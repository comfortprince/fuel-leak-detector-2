import React from 'react';
import { Box, Pagination, PaginationItem } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import { router } from '@inertiajs/react';

export default function AlertPagination({ alertsData }) {
  // Extract data from the provided object
  const currentPage = alertsData.current_page;
  const lastPage = alertsData.last_page;
  const totalItems = alertsData.total;
  const itemsPerPage = alertsData.per_page;
  
  const handlePageChange = (event, page) => {
    console.log(`Navigating to page ${page}`);
    router.visit(`/alerts?page=${page}`, {
        method: 'get',
        preserveScroll: true
    })
  };

  return (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mt: 1
    }}>
      <Box 
        sx={{
            fontSize: 16,
            color: 'darkgray'
        }}
        >
        Showing {currentPage * itemsPerPage - itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </Box>
      
      <Pagination
        count={lastPage}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size="medium"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={2}
        renderItem={(item) => (
          <PaginationItem
            components={{
              previous: NavigateBeforeIcon,
              next: NavigateNextIcon
            }}
            {...item}
          />
        )}
      />
    </Box>
  );
}