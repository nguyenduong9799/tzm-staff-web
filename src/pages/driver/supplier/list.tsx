import { ArrowForward } from '@mui/icons-material';
import { Box, Card, CircularProgress, Container, Fab, Stack, Typography } from '@mui/material';
import Page from 'components/Page';
import React from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import { Supplier } from 'types/supplier';
import request from 'utils/axios';

type Props = {};

const SupplierList = (props: Props) => {
  const { data: suppliers, isLoading } = useQuery(['suppliers'], () =>
    request.get<{ data: Supplier[] }>(`/stores/150/suppliers`).then((res) => res.data.data)
  );
  const navigate = useNavigate();

  const renderSupplier = (supplier: Supplier) => (
    <Card key={supplier.id}>
      <Box sx={{ px: 2, py: 1 }}>
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">{supplier.name}</Typography>
            <Typography>{supplier.contact_person ?? '-'}</Typography>
          </Box>
          <Box>
            <Fab
              size="small"
              onClick={() => {
                navigate(PATH_DASHBOARD.driver.suppliers.supplierOrder(supplier.id));
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

  return (
    <Page title="Danh sách nhà cung cấp">
      <Container>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4">Danh sách nhà cung cấp</Typography>
        </Box>
        <Box>
          {isLoading ? (
            <Box textAlign="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Stack spacing={2}>{suppliers?.map(renderSupplier)}</Stack>
            </Box>
          )}
        </Box>
      </Container>
    </Page>
  );
};

export default SupplierList;
