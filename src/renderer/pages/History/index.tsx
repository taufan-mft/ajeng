import { Button, Table, DatePicker, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';

import moment, { Moment } from 'moment';
import { useState } from 'react';
import dayjs from 'dayjs';
import { db } from '../../db/db';

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: 'Nama Toko',
    dataIndex: 'shopName',
    key: 'shopName',
  },
  {
    title: 'Nama',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Nomor KK',
    dataIndex: 'kKNumber',
    key: 'kKNumber',
  },
  {
    title: 'NIK',
    dataIndex: 'nik',
    key: 'nik',
  },
  {
    title: 'Alamat',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'NPWP',
    dataIndex: 'npwp',
    key: 'npwp',
  },
  {
    title: 'Berat',
    dataIndex: 'weight',
    key: 'weight',
  },
  {
    title: 'Tanggal',
    dataIndex: 'timeStamp',
    key: 'timeStamp',
  },
];
const { RangePicker } = DatePicker;
const History = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Array<Moment>>([
    moment().set('hour', 1),
    moment().set('hour', 23),
  ]);
  const [kk, setKk] = useState('');
  const friends = useLiveQuery(() => {
    console.log('farfarin', selectedDate.length);
    const theDb = db.friends;
    if (selectedDate.length > 1 && kk === '') {
      return db.friends
        .where('timeStamp')
        .between(
          selectedDate[0].set('hour', 1).toDate(),
          selectedDate[1].set('hour', 23).toDate()
        )
        .toArray();
    }
    if (selectedDate.length > 1 && kk !== '') {
      return db.friends
        .where('[kKNumber+timeStamp]')
        .between(
          [kk, selectedDate[0].set('hour', 1).toDate()],
          [kk, selectedDate[0].set('hour', 23).toDate()]
        )
        .toArray();
    }
    return theDb.toArray();
  }, [selectedDate, kk]);
  console.log('the friends', friends);
  const dataSource = friends?.map((friend, index) => ({
    key: index,
    no: index,
    shopName: friend.shopName,
    name: friend.name,
    kKNumber: friend.kKNumber,
    nik: friend.nik,
    address: friend.address,
    npwp: friend.npwp,
    weight: friend.weight,
    timeStamp: friend.timeStamp.toLocaleDateString(),
  }));

  const handleSave = () => {
    window.electron.ipcRenderer.on('tasya', (data) => {
      console.log('the data', data);
    });
    // @ts-ignore
    window.electron.ipcRenderer.openTasya(dataSource);
  };

  const onChange = (dates: Array<Moment>) => {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    setSelectedDate([dates[0], dates[1]]);
  };

  return (
    <div style={{ minWidth: '500px' }}>
      <h1>History</h1>
      <br />
      <Button onClick={() => navigate(-1)}>Kembali</Button>
      <br />
      <br />
      <RangePicker defaultValue={[moment(), moment()]} onChange={onChange} />
      <br />
      <br />
      <Input placeholder="Cari No KK" onChange={(e) => setKk(e.target.value)} />
      <br />
      <br />
      <Button onClick={handleSave}>Save</Button>
      <br />
      <br />
      <Table pagination={false} dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default History;
