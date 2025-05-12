import React from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Table,
  Descriptions,
  Divider,
  Space,
  Image,
  Timeline,
} from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  GlobalOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// Fake data
const fakeCompanyData = {
  companyName: "TechVision Solutions",
  companyEmail: "contact@techvision.com",
  missionStatement: "At TechVision Solutions, our mission is to empower businesses through innovative technology solutions while fostering a culture of continuous learning and growth. We are committed to delivering cutting-edge digital transformations that drive operational excellence and sustainable success for our clients. By combining deep industry expertise with forward-thinking technology, we help organizations navigate the complexities of the digital age, enabling them to make data-driven decisions and stay ahead of market trends. Our dedicated team of experts works tirelessly to create customized solutions that address unique business challenges, ensuring that every client receives the attention and expertise they deserve. Through our unwavering commitment to quality, innovation, and client satisfaction, we strive to be the trusted technology partner that businesses rely on for their digital journey.",
  phoneNumber: "+1 (555) 123-4567",
  website: "www.techvision.com",
  country: "United States",
  state: "California",
  city: "San Francisco",
  timezone: "America/Los_Angeles",
  logo: "https://via.placeholder.com/150",
  companyValues: [,
    {
      category: "innovation",
      value: "Innovation First",
      description: "We embrace change and continuously seek new ways to solve problems."
    },
    {
      category: "teamwork",
      value: "Collaborative Excellence",
      description: "We believe in the power of working together to achieve extraordinary results."
    },
    {
      category: "integrity",
      value: "Ethical Leadership",
      description: "We conduct our business with the highest standards of integrity and transparency."
    },
    {
      category: "innovation",
      value: "Innovation First",
      description: "We embrace change and continuously seek new ways to solve problems."
    },
    {
      category: "teamwork",
      value: "Collaborative Excellence",
      description: "We believe in the power of working together to achieve extraordinary results."
    },
    {
      category: "integrity",
      value: "Ethical Leadership",
      description: "We conduct our business with the highest standards of integrity and transparency."
    }
  ],
  fiscalYears: [
    {
      startDate: dayjs('2024-01-01'),
      endDate: dayjs('2024-12-31'),
      isActive: true
    },
    {
      startDate: dayjs('2023-01-01'),
      endDate: dayjs('2023-12-31'),
      isActive: false
    }
  ],
  workingWeek: {
    monday: { isActive: true, startTime: dayjs().hour(9).minute(0), endTime: dayjs().hour(17).minute(0) },
    tuesday: { isActive: true, startTime: dayjs().hour(9).minute(0), endTime: dayjs().hour(17).minute(0) },
    wednesday: { isActive: true, startTime: dayjs().hour(9).minute(0), endTime: dayjs().hour(17).minute(0) },
    thursday: { isActive: true, startTime: dayjs().hour(9).minute(0), endTime: dayjs().hour(17).minute(0) },
    friday: { isActive: true, startTime: dayjs().hour(9).minute(0), endTime: dayjs().hour(17).minute(0) },
    saturday: { isActive: false, startTime: null, endTime: null },
    sunday: { isActive: false, startTime: null, endTime: null }
  },
  celebrateEmployees: true,
  newEmployee: true,
  workAnniversary: true,
  birthdays: true
};

const CompanyView: React.FC = () => {
  const workingWeekColumns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Working' : 'Not Working'}
        </Tag>
      ),
    },
    {
      title: 'Working Hours',
      dataIndex: 'hours',
      key: 'hours',
      render: (_: any, record: any) => {
        if (!record.isActive) return 'N/A';
        return `${record.startTime.format('h:mm A')} - ${record.endTime.format('h:mm A')}`;
      },
    },
  ];

  const workingWeekData = Object.entries(fakeCompanyData.workingWeek).map(([key, value]) => ({
    key,
    day: key.charAt(0).toUpperCase() + key.slice(1),
    ...value
  }));

  const fiscalYearColumns = [
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: dayjs.Dayjs) => date.format('MMMM D, YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: dayjs.Dayjs) => date.format('MMMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* Company Header */}
        <Col span={24}>
          <Card>
            <Row gutter={24} align="middle">
              <Col span={4}>
                <Image
                  src={fakeCompanyData.logo}
                  alt="Company Logo"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Col>
              <Col span={20}>
                <Title level={2}>{fakeCompanyData.companyName}</Title>
                <Space direction="vertical" size="small">
                  <Space>
                    <MailOutlined /> {fakeCompanyData.companyEmail}
                  </Space>
                  <Space>
                    <PhoneOutlined /> {fakeCompanyData.phoneNumber}
                  </Space>
                  <Space>
                    <GlobalOutlined /> {fakeCompanyData.website}
                  </Space>
                  <Space>
                    <EnvironmentOutlined /> {`${fakeCompanyData.city}, ${fakeCompanyData.state}, ${fakeCompanyData.country}`}
                  </Space>
                  <Space>
                    <ClockCircleOutlined /> {fakeCompanyData.timezone}
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Mission Statement */}
        <Col span={24}>
          <Card title="Mission Statement">
            <Paragraph>{fakeCompanyData.missionStatement}</Paragraph>
          </Card>
        </Col>

        {/* Company Values */}
        <Col span={24}>
          <Card title="Company Values">
            <Row gutter={[16, 16]}>
              {fakeCompanyData.companyValues.map((value, index) => (
                <Col span={8} key={index}>
                  <Card size="small" title={value.value}>
                    <Tag color="blue">{value.category}</Tag>
                    <Paragraph style={{ marginTop: 8 }}>{value.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Working Hours */}
        <Col span={24}>
          <Card title="Working Hours">
            <Table
              columns={workingWeekColumns}
              dataSource={workingWeekData}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Fiscal Years */}
        <Col span={24}>
          <Card title="Fiscal Years">
            <Table
              columns={fiscalYearColumns}
              dataSource={fakeCompanyData.fiscalYears}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Employee Celebrations */}
        <Col span={24}>
          <Card 
            title={
              <Space>
                <GiftOutlined />
                Employee Celebrations
                <Tag color={fakeCompanyData.celebrateEmployees ? 'green' : 'red'}>
                  {fakeCompanyData.celebrateEmployees ? 'Enabled' : 'Disabled'}
                </Tag>
              </Space>
            }
          >
            {fakeCompanyData.celebrateEmployees && (
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" title="New Employee">
                    <Tag color={fakeCompanyData.newEmployee ? 'green' : 'default'}>
                      {fakeCompanyData.newEmployee ? 'Last 30 Days' : 'Disabled'}
                    </Tag>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Work Anniversary">
                    <Tag color={fakeCompanyData.workAnniversary ? 'green' : 'default'}>
                      {fakeCompanyData.workAnniversary ? 'Enabled' : 'Disabled'}
                    </Tag>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="Birthdays">
                    <Tag color={fakeCompanyData.birthdays ? 'green' : 'default'}>
                      {fakeCompanyData.birthdays ? 'Enabled' : 'Disabled'}
                    </Tag>
                  </Card>
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyView;