/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ArrowForward } from '@mui/icons-material';
import { Box, Card, CircularProgress, Container, Fab, Stack, Typography } from '@mui/material';
// @mui
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Outlet, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { Store } from 'types/store';
import request from 'utils/axios';
import { AREA_COOKIE_KEY, AREA_STORAGE_KEY } from 'utils/constants';
import { delete_cookie, getAreaStorage, removeLocalStorage, setAreaStorage } from 'utils/utils';
// config
import { HEADER, NAVBAR } from '../../config';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import useResponsive from '../../hooks/useResponsive';
// hooks
import useSettings from '../../hooks/useSettings';
//
import DashboardHeader from './header';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import NavbarVertical from './navbar/NavbarVertical';

// ----------------------------------------------------------------------

type MainStyleProps = {
  collapseClick: boolean;
};

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { collapseClick, isCollapse } = useCollapseDrawer();
  const { themeLayout } = useSettings();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState<Store | null>(() => {
    try {
      return JSON.parse(getAreaStorage());
    } catch (e) {
      return null;
    }
  });
  const verticalLayout = themeLayout === 'vertical';
  const { data: stores, isLoading } = useQuery(['stores'], () =>
    request
      .get<{
        data: Store[];
      }>(`/stores`, {
        params: {
          type: 8,
          'main-store': false,
          'has-menu': true,
        },
      })
      .then((res) => res.data.data)
  );
  const handleClick = () => {
    setCurrentStore(null);
    removeLocalStorage(AREA_COOKIE_KEY);
  };
  const navigate = useNavigate();
  const renderStore = (store: Store) => (
    <Card key={store.id}>
      <Box sx={{ px: 2, py: 1 }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{store.name}</Typography>
            <Typography>{store.address}</Typography>
          </Box>
          <Box>
            <Fab
              size="small"
              onClick={() => {
                setCurrentStore(store);
                setAreaStorage(store);
                navigate(PATH_DASHBOARD.root);
              }}
              color="primary"
              aria-label="add"
            >
              <ArrowForward />
            </Fab>
          </Box>
        </Stack>
      </Box>
    </Card>
  );

  if (currentStore == null) {
    return (
      <Page title="Danh sách các khu vực">
        <Container>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4">Danh sách các khu vực</Typography>
          </Box>
          <Box>
            {isLoading ? (
              <Box textAlign="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <Stack spacing={2}>{stores?.map(renderStore)}</Stack>
              </Box>
            )}
          </Box>
        </Container>
      </Page>
    );
  } else if (verticalLayout) {
    return (
      <>
        <DashboardHeader
          handleClick={handleClick}
          onOpenSidebar={() => setOpen(true)}
          verticalLayout={verticalLayout}
          store={currentStore}
        />

        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        )}

        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
        </Box>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        <DashboardHeader
          handleClick={handleClick}
          isCollapse={isCollapse}
          onOpenSidebar={() => setOpen(true)}
          store={currentStore}
        />

        <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

        <MainStyle collapseClick={collapseClick}>
          <Outlet />
        </MainStyle>
      </Box>
    </>
  );
}
