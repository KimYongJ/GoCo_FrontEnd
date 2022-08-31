import axios from 'axios';
import moment from 'moment';
import { sweetAlert2, sweetAlertSuccess } from '../../component/auth/AuthSweetAlert.js/sweetAlert2';
import { getCookie } from '../authAPI';

export const workGetData = async (setGetWorkList, getEmpId, user) => {
  console.log(getEmpId);
  const response = await axios.get(
    `http://localhost:8080/api/user/work/calendar?empId=${getEmpId}`,
    {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    }
  );
  let data;

  console.log(response.data);
  if (response.data.length !== 0) {
    data = response.data.map((rowData) => ({
      id: rowData.id,
      title: rowData.title,
      start: rowData.start,
      end: rowData.end,
    }));
  } else {
    data = {
      id: 0,
      title: '',
      start: '',
      end: '',
    };
  }

  setGetWorkList(data);
};

export const getWorkListData = async (privateSetData, publicSetData) => {
  await axios
    .get('http://localhost:8080/api/user/work', {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      let privatedata = response.data.filter(
        (work) => work.workStartDate === null && work.workEndDate === null && work.workType === true
      );
      let publicdata = response.data.filter(
        (work) =>
          work.workStartDate === null && work.workEndDate === null && work.workType === false
      );
      privateSetData(privatedata);
      publicSetData(publicdata);
    });
};

export const commuteTime = async (setCommuteTimeData) => {
  await axios
    .get(`http://localhost:8080/api/user/commute/time`, {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      setCommuteTimeData(response.data);
    });
};

export const getEmployeeList = async (setEmp) => {
  await axios
    .get('http://localhost:8080/api/user/work/emplist', {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      setEmp(response.data);
    });
};

export const loginDefaultValue = async (setLoginEmp) => {
  await axios
    .get('http://localhost:8080/api/user/me', {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      setLoginEmp(response.data);
    });
};

export const headerData = async (setStatusData) => {
  await axios
    .get('http://localhost:8080/api/user/menu/commute', {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      setStatusData(response.data);
    });
};

export const dateWorkList = async (requestDate, setDetailList, getEmpId) => {
  await axios
    .post(
      `http://localhost:8080/api/user/work/detail?empId=${getEmpId}`,
      {
        workStartDate: new Date(moment(requestDate).format('YYYY-MM-DD')),
        employee: {
          empId: getEmpId,
        },
      },
      {
        headers: {
          'access-control-allow-origin': 'true',
          Authorization: `Bearer ${getCookie('accessToken')}`,
        },
      }
    )
    .then((response) => {
      setDetailList(response.data);
    });
};

export const dialogDetailList = async (workId, setDetailWorkList) => {
  await axios
    .get(`http://localhost:8080/api/user/work/${workId}`, {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      setDetailWorkList(response.data);
    });
};

export const addWork = async (workData) => {
  await axios
    .post(`http://localhost:8080/api/user/work`, workData, {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      if (response.data) {
        window.location.replace('/goco');
      } else {
        alert('등록이 안되었습니다.');
      }
    });
};

export const updateWork = async (workData) => {
  await axios
    .put(`http://localhost:8080/api/user/work`, workData, {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      if (response.data) {
        window.location.replace('/goco');
      } else {
        alert('수정이 실패 했습니다.');
      }
    });
};

export const deleteWork = async (workId) => {
  await axios
    .delete(`http://localhost:8080/api/user/work/${workId}`, {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      if (response.data) {
        window.location.replace('/goco');
      } else {
        alert('삭제가 실패 했습니다.');
      }
    });
};

export const commuteUpdate = async (work) => {
  await axios
    .put(`http://localhost:8080/api/user/commute`, work, {
      headers: {
        'access-control-allow-origin': 'true',
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    })
    .then((response) => {
      if (response.data.status === 'ALREADY_DONE') {
        sweetAlertSuccess(response.data.message, 'error', '/goco');
      } else if (response.data.status === 'OK') {
        sweetAlertSuccess(response.data.message, 'success', '/goco');
      }
    });
};
