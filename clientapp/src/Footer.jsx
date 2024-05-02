import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

function Footer() {
  return (
    <AntFooter style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#f0f2f5', textAlign: 'center', padding: '16px 0' }}>
      <Text>© 2024 Ứng Dụng Đọc Truyện Chữ Online. Project2-20215519.</Text>
      <br />
    </AntFooter>
  );
}

export default Footer;
