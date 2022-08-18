import react, { useState, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import {
  approveBusinessTrip,
  deleteBusinessTrip,
  getBusinessTrip,
} from '../../../api/businessTripAPI';
import { Button, TablePagination } from '@mui/material';
import Swal from 'sweetalert2';
import { confirm } from '../../../common/confirm';

function createData(name, startDate, endDate, requestDate, approve, detail, business) {
  return {
    name,
    startDate,
    endDate,
    requestDate,
    approve,
    detail,
    business,
  };
}

const approveType = {
  APPROVE_WAITTING: '결재대기',
  APPROVE_SUCCESS: '승인',
  APPROVE_REFUSE: '반려',
  APPROVE_CANCEL: '승인취소',
};

function Row(props) {
  const { row, check, setCheck } = props;
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      {/* <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}> */}
      <TableRow>
        {/* <TableCell component="th" scope="row"> */}
        <TableCell></TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">{row.startDate.split('T')[0]}</TableCell>
        <TableCell align="center">{row.endDate.split('T')[0]}</TableCell>
        <TableCell align="center">{row.requestDate.split('T')[0]}</TableCell>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{approveType[row.approve]}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }} textAlign={'center'}>
              <Typography variant="h6" gutterBottom component="div">
                Detail
              </Typography>
              <Box>
                <div>
                  {row.detail.approveDate && '결재일: ' + row.detail.approveDate.split('T')[0]}
                </div>
                <div>{row.detail.content}</div>
                <div>
                  {row.detail.file && row.detail.file.originalName}
                  {row.detail.file && (
                    <a href={row.detail.file.filePath}>
                      <IconButton color="primary">
                        <SimCardDownloadOutlinedIcon align="bottom"></SimCardDownloadOutlinedIcon>
                      </IconButton>
                    </a>
                  )}
                </div>
                {row.approve === 'APPROVE_WAITTING' && (
                  <div>
                    <Button
                      onClick={() => {
                        confirm('결재를 승인 하시겠습니까?').then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire('결재가 승인 되었습니다', '', 'success');
                            row.business.approveYn = 'APPROVE_SUCCESS';
                            approveBusinessTrip(row.business, check, setCheck);
                          }
                        });
                      }}>
                      결재승인
                    </Button>
                    <Button
                      onClick={() => {
                        confirm('결재를 반려 하시겠습니까?').then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire('결재가 반려 되었습니다', '', 'success');
                            row.business.approveYn = 'APPROVE_REFUSE';
                            approveBusinessTrip(row.business, check, setCheck);
                          }
                        });
                      }}>
                      결재반려
                    </Button>
                  </div>
                )}
                {row.approve === 'APPROVE_SUCCESS' && (
                  <div>
                    <Button
                      onClick={() => {
                        confirm('승인 된 결재 입니다. 승인을 취소 하시겠습니까? ').then(
                          (result) => {
                            if (result.isConfirmed) {
                              Swal.fire('승인이 취소 되었습니다', '', 'success');
                            }
                          }
                        );
                        row.business.approveYn = 'APPROVE_CANCEL';
                        approveBusinessTrip(row.business, check, setCheck);
                      }}>
                      승인취소
                    </Button>
                  </div>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
export default function ManagerBusinessTrips() {
  const [businessList, setBusinessList] = useState([]);
  const [check, setCheck] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    getBusinessTrip(setBusinessList, 1);
  }, [check]);
  const rows = [];
  if (businessList.length) {
    businessList.map((business) => {
      console.log(business);
      let detail = {
        content: business.businessTripContent,
        approveDate: business.businessTripApproveDate,
        file: business.file,
      };
      rows.push(
        createData(
          business.employee.name,
          business.businessTripStartDate,
          business.businessTripEndDate,
          business.businessTripRequestDate,
          business.approveYn,
          detail,
          business
        )
      );
    });
  }
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center">팀원 이름</TableCell>
            <TableCell align="center">출장 시작일</TableCell>
            <TableCell align="center">출장 종료일</TableCell>
            <TableCell align="center">신청 일자</TableCell>
            <TableCell />
            <TableCell align="center">승인 상태</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <Row key={index} row={row} check={check} setCheck={setCheck} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}