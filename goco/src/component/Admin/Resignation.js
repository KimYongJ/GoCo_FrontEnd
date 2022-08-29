import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useState } from 'react';

export const Resignation = ({ resignations }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <TableContainer sx={{ height: '45vh' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>전화번호</TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>퇴사일</TableCell>
            <TableCell>입사일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resignations &&
            (rowsPerPage > 0
              ? resignations?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : resignations
            ).map((resignation) => {
              return (
                <TableRow key={resignation.empNum}>
                  <TableCell>{resignation.name}</TableCell>
                  <TableCell>{resignation.phoneNumber}</TableCell>
                  <TableCell>{resignation.email}</TableCell>
                  <TableCell>
                    {resignation.resignationDate
                      .split('T', 1)[0]
                      .replace('-', '년')
                      .replace('-', '월') + `일`}
                  </TableCell>
                  <TableCell>
                    {resignation.hiredate.split('T', 1)[0].replace('-', '년').replace('-', '월') +
                      `일`}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={resignations?.length || 1}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};