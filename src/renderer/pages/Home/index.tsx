import { useState } from 'react';
import { Button, Input, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { db, Friend } from '../../db/db';

const Home = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [canBuy, setCanBuy] = useState(true);
  const [newUser, setNewUser] = useState(false);
  const [status, setStatus] = useState('');

  const onKkChange = async (value: string) => {
    try {
      const usersList = await db.friends
        .where('kKNumber')
        .equals(value)
        .toArray();
      console.log('the user list', usersList);
      if (usersList.length < 1) {
        setNewUser(true);
        form.setFieldsValue({
          address: '',
          nik: '',
          npwp: '',
          shopName: '',
          weight: '',
          name: '',
        });
      } else {
        setNewUser(false);
        form.setFieldsValue({
          address: usersList[0].address,
          nik: usersList[0].nik,
          npwp: usersList[0].npwp,
          shopName: usersList[0].shopName,
          name: usersList[0].name,
        });
      }

      const hasBuyList = await db.friends
        .where('[kKNumber+timeStamp]')
        .between(
          [value, dayjs().set('hour', 1).toDate()],
          [value, dayjs().set('hour', 23).toDate()]
        )
        .toArray();

      if (hasBuyList.length > 0) {
        setCanBuy(false);
      } else {
        setCanBuy(true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const onFinish = async (values: Friend) => {
    console.log('si tasya', values);
    const id = await db.friends.add({
      address: values.address,
      kKNumber: values.kKNumber,
      nik: values.nik,
      npwp: values.npwp,
      shopName: values.shopName,
      weight: values.weight,
      name: values.name,
      timeStamp: new Date(Date.now()),
    });
    console.log('tasyaa', id);
  };

  return (
    <div style={{ minWidth: '500px' }}>
      <h1>Toko Minyak Ajeng</h1>
      <Button onClick={() => navigate('/history')}>History</Button>
      <br />
      <br />
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="Nomor KK"
          name="kKNumber"
          rules={[{ required: true, message: 'Masukkan KK' }]}
        >
          <Input onChange={(e) => onKkChange(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Berat"
          name="weight"
          rules={[{ required: true, message: 'Masukkan Jumlah Pembelian' }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="NIK"
          name="nik"
          rules={[{ required: true, message: 'Masukkan NIK' }]}
        >
          <Input disabled={!newUser} />
        </Form.Item>
        <Form.Item
          label="Nama"
          name="name"
          rules={[{ required: true, message: 'Masukkan Nama' }]}
        >
          <Input disabled={!newUser} />
        </Form.Item>
        <Form.Item
          label="Nama Toko"
          name="shopName"
          rules={[{ required: true, message: 'Masukkan Nama Toko' }]}
        >
          <Input disabled={!newUser} />
        </Form.Item>
        <Form.Item
          label="Alamat"
          name="address"
          rules={[{ required: true, message: 'Masukkan Alamat' }]}
        >
          <Input disabled={!newUser} />
        </Form.Item>
        <Form.Item
          label="NPWP"
          name="npwp"
          rules={[{ required: true, message: 'Masukkan NPWP' }]}
        >
          <Input disabled={!newUser} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!canBuy}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Home;
