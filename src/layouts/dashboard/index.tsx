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
  const verticalLayout = themeLayout === 'vertical';
  const handleClick = () => {};
  if (verticalLayout) {
    return (
      <>
        <DashboardHeader
          handleClick={handleClick}
          onOpenSidebar={() => setOpen(true)}
          verticalLayout={verticalLayout}
          // store={currentStore}
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
          // store={currentStore}
        />

        <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

        <MainStyle collapseClick={collapseClick}>
          <Outlet />
        </MainStyle>
      </Box>
    </>
  );
}
