'use client';

import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Upload, 
  Checkbox, 
  Switch,
  Card,
  Space,
  Typography,
  message,
  Row,
  Col,
  Divider,
  Table,
  Radio,
  Tag,
  TimePicker,
  Empty,
  Select
} from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface CompanyValue {
  value: string;
  description: string;
}

interface WorkingWeekData {
  key: string;
  day: string;
  isActive: boolean;
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
}

interface FiscalYearData {
  key: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  isActive?: boolean;
}

interface CompanyFormData {
  companyName: string;
  companyEmail: string;
  missionStatement: string;
  phoneNumber: string;
  website: string;
  country: string;
  state: string;
  city: string;
  timezone: string;
  companyValues: CompanyValue[];
  logo: any;
  fiscalYears: FiscalYearData[];
  workingWeek: Record<string, { 
    isActive: boolean;
    startTime?: dayjs.Dayjs;
    endTime?: dayjs.Dayjs;
  }>;
  celebrateEmployees: boolean;
  newEmployee: boolean;
  workAnniversary: boolean;
  birthdays: boolean;
  enableCompanyValues?: boolean;
}

const TIMEZONE_OPTIONS = [
  { value: 'Pacific/Midway', label: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'America/Adak', label: '(GMT-10:00) Hawaii-Aleutian' },
  { value: 'Etc/GMT+10', label: '(GMT-10:00) Hawaii' },
  { value: 'Pacific/Marquesas', label: '(GMT-09:30) Marquesas Islands' },
  { value: 'Pacific/Gambier', label: '(GMT-09:00) Gambier Islands' },
  { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'America/Caracas', label: '(GMT-04:30) Caracas' },
  { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'America/St_Johns', label: '(GMT-03:30) Newfoundland' },
  { value: 'America/Argentina/Buenos_Aires', label: '(GMT-03:00) Buenos Aires' },
  { value: 'Atlantic/South_Georgia', label: '(GMT-02:00) Mid-Atlantic' },
  { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
  { value: 'Europe/London', label: '(GMT+00:00) London, Lisbon, Casablanca' },
  { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin, Rome, Paris, Madrid' },
  { value: 'Europe/Athens', label: '(GMT+02:00) Athens, Bucharest, Istanbul' },
  { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow, St. Petersburg' },
  { value: 'Asia/Tehran', label: '(GMT+03:30) Tehran' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Abu Dhabi, Muscat' },
  { value: 'Asia/Kabul', label: '(GMT+04:30) Kabul' },
  { value: 'Asia/Karachi', label: '(GMT+05:00) Islamabad, Karachi' },
  { value: 'Asia/Kolkata', label: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
  { value: 'Asia/Kathmandu', label: '(GMT+05:45) Kathmandu' },
  { value: 'Asia/Dhaka', label: '(GMT+06:00) Astana, Dhaka' },
  { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'Asia/Shanghai', label: '(GMT+08:00) Beijing, Perth, Singapore, Hong Kong' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk' },
  { value: 'Australia/Adelaide', label: '(GMT+09:30) Adelaide, Darwin' },
  { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney, Melbourne, Brisbane' },
  { value: 'Pacific/Noumea', label: '(GMT+11:00) Magadan, Solomon Islands, New Caledonia' },
  { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka' },
];

const VALUE_CATEGORIES = [
  { value: 'leadership', label: 'Leadership' },
  { value: 'integrity', label: 'Integrity' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'teamwork', label: 'Teamwork' },
  { value: 'excellence', label: 'Excellence' },
  { value: 'respect', label: 'Respect' },
  { value: 'accountability', label: 'Accountability' },
  { value: 'customer-focus', label: 'Customer Focus' },
];

const CompanyCreateForm: React.FC = () => {
  const [form] = Form.useForm();
  const [celebrateEmployees, setCelebrateEmployees] = useState(false);
  const [enableCompanyValues, setEnableCompanyValues] = useState(true);

  const defaultStartTime = dayjs().hour(9).minute(0);
  const defaultEndTime = dayjs().hour(17).minute(0);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(values),
      });
      const result = await response.json();
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.message || 'Failed to create company');
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const workingWeekColumns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      width: '20%',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      render: (_: unknown, record: WorkingWeekData) => (
        <Form.Item
          name={['workingWeek', record.key, 'isActive']}
          valuePropName="checked"
          noStyle
        >
          <Switch 
            onChange={(checked) => {
              if (checked) {
                form.setFieldsValue({
                  workingWeek: {
                    ...form.getFieldValue('workingWeek'),
                    [record.key]: {
                      isActive: true,
                      startTime: defaultStartTime,
                      endTime: defaultEndTime
                    }
                  }
                });
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Working Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: '65%',
      render: (_: unknown, record: WorkingWeekData) => (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => {
            return prevValues?.workingWeek?.[record.key]?.isActive !== 
                   currentValues?.workingWeek?.[record.key]?.isActive;
          }}
        >
          {() => {
            const isActive = form.getFieldValue(['workingWeek', record.key, 'isActive']);
            return isActive ? (
              <Space>
                <Form.Item
                  name={['workingWeek', record.key, 'startTime']}
                  noStyle
                >
                  <TimePicker 
                    format="h:mm A"
                    minuteStep={15}
                    defaultValue={defaultStartTime}
                  />
                </Form.Item>
                <span>to</span>
                <Form.Item
                  name={['workingWeek', record.key, 'endTime']}
                  noStyle
                >
                  <TimePicker 
                    format="h:mm A"
                    minuteStep={15}
                    defaultValue={defaultEndTime}
                  />
                </Form.Item>
              </Space>
            ) : (
              <Text type="secondary">Not working</Text>
            );
          }}
        </Form.Item>
      ),
    },
  ];

  const workingWeekData: WorkingWeekData[] = [
    { key: 'monday', day: 'Monday', isActive: true, startTime: defaultStartTime, endTime: defaultEndTime },
    { key: 'tuesday', day: 'Tuesday', isActive: true, startTime: defaultStartTime, endTime: defaultEndTime },
    { key: 'wednesday', day: 'Wednesday', isActive: true, startTime: defaultStartTime, endTime: defaultEndTime },
    { key: 'thursday', day: 'Thursday', isActive: true, startTime: defaultStartTime, endTime: defaultEndTime },
    { key: 'friday', day: 'Friday', isActive: true, startTime: defaultStartTime, endTime: defaultEndTime },
    { key: 'saturday', day: 'Saturday', isActive: false, startTime: defaultStartTime, endTime: defaultEndTime },
    { key: 'sunday', day: 'Sunday', isActive: false, startTime: defaultStartTime, endTime: defaultEndTime },
  ];

  const fiscalYearColumns = [
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '30%',
      render: (_: unknown, record: FiscalYearData) => (
        <Form.Item
          name={['fiscalYears', record.key, 'startDate']}
          noStyle
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '30%',
      render: (_: unknown, record: FiscalYearData) => (
        <Form.Item
          name={['fiscalYears', record.key, 'endDate']}
          noStyle
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '30%',
      render: (_: unknown, record: FiscalYearData) => (
        <Form.Item
          name={['fiscalYears', record.key, 'isActive']}
          noStyle
        >
          <Radio.Group>
            <Radio value={true}>Active</Radio>
            <Radio value={false}>Inactive</Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_: unknown, record: FiscalYearData) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            const fiscalYears = form.getFieldValue('fiscalYears') || [];
            form.setFieldsValue({
              fiscalYears: fiscalYears.filter((_: FiscalYearData, index: number) => index !== record.key)
            });
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>Create Company</Title>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[24, 24]}>
          {/* Basic Information Section */}
          <Col span={24}>
            <Card title="Basic Information">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="companyName"
                    label="Company Name"
                    rules={[{ required: true, message: 'Please input company name!' }]}
                  >
                    <Input placeholder="Enter company name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="companyEmail"
                    label="Company Email"
                    rules={[
                      { required: true, message: 'Please input company email!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input placeholder="Enter company email" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="missionStatement"
                label="Mission Statement"
                rules={[{ required: true, message: 'Please input mission statement!' }]}
              >
                <TextArea rows={4} placeholder="Enter mission statement" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input phone number!' }]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="website"
                    label="Website"
                    rules={[{ required: true, message: 'Please input website!' }]}
                  >
                    <Input placeholder="Enter website URL" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left" style={{ marginTop: 24, marginBottom: 24 }}>Address</Divider>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[{ required: true, message: 'Please input country!' }]}
                  >
                    <Input placeholder="Enter country" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="state"
                    label="State/Province"
                    rules={[{ required: true, message: 'Please input state/province!' }]}
                  >
                    <Input placeholder="Enter state or province" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: 'Please input city!' }]}
                  >
                    <Input placeholder="Enter city" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="timezone"
                    label="Timezone"
                    rules={[{ required: true, message: 'Please select timezone!' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select timezone"
                      options={TIMEZONE_OPTIONS}
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Company Values Section */}
          <Col span={24}>
            <Card 
              title={
                <Row justify="space-between" align="middle">
                  <Col>Company Values</Col>
                  <Col>
                    <Form.Item
                      name="enableCompanyValues"
                      valuePropName="checked"
                      initialValue={true}
                      noStyle
                    >
                      <Switch 
                        onChange={(checked) => setEnableCompanyValues(checked)}
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Company values are useful for shaping the culture and supporting the vision of your company. Employees can tag company values when giving feedback.
              </Text>
              
              {enableCompanyValues && (
                <Form.List name="companyValues">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.length === 0 && (
                        <Empty
                          description="No company values yet. Add your first value to get started!"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          style={{ margin: '32px 0' }}
                        />
                      )}
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={[16, 16]} align="top" style={{ marginBottom: 24 }}>
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'category']}
                              label="Category"
                              rules={[{ required: true, message: 'Select category' }]}
                            >
                              <Select
                                placeholder="Select category"
                                options={VALUE_CATEGORIES}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={10}>
                            <Form.Item
                              {...restField}
                              name={[name, 'value']}
                              rules={[{ required: true, message: 'Missing value' }]}
                            >
                              <Input placeholder="Enter company value" />
                            </Form.Item>
                          </Col>
                          <Col span={14}>
                            <Form.Item
                              {...restField}
                              name={[name, 'description']}
                              rules={[{ required: true, message: 'Missing description' }]}
                            >
                              <TextArea 
                                placeholder="Describe this value" 
                                rows={3}
                                showCount
                                maxLength={200}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Button 
                              type="text" 
                              danger
                              icon={<MinusCircleOutlined />} 
                              onClick={() => remove(name)}
                              style={{ marginTop: 4 }}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button 
                          type="dashed" 
                          onClick={() => add()} 
                          block 
                          icon={<PlusOutlined />}
                          style={{ marginTop: 16 }}
                        >
                          Add Company Value
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              )}
            </Card>
          </Col>

          {/* Company Settings Section */}
          <Col span={24}>
            <Card title="Company Settings">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="logo"
                    label="Company Logo"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                      if (Array.isArray(e)) {
                        return e;
                      }
                      return e?.fileList;
                    }}
                  >
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      beforeUpload={() => false}
                      showUploadList={{ showPreviewIcon: false }}
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Fiscal Years</Divider>
              <Form.List name="fiscalYears">
                {(fields, { add, remove }) => (
                  <>
                    <Table
                      columns={fiscalYearColumns}
                      dataSource={fields.map((field, index) => ({ ...field, key: index }))}
                      pagination={false}
                      size="middle"
                    />
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginTop: 16 }}
                    >
                      Add Fiscal Year
                    </Button>
                  </>
                )}
              </Form.List>

              <Divider orientation="left">Working Week</Divider>
              <Form.Item
                name="workingWeek"
                initialValue={workingWeekData.reduce((acc, day) => ({
                  ...acc,
                  [day.key]: {
                    isActive: day.isActive,
                    startTime: day.startTime,
                    endTime: day.endTime
                  }
                }), {})}
              >
                <Table
                  columns={workingWeekColumns}
                  dataSource={workingWeekData}
                  pagination={false}
                  size="middle"
                />
              </Form.Item>
            </Card>
          </Col>

          {/* Employee Celebrations Section */}
          <Col span={24}>
            <Card 
              title={
                <Row justify="space-between" align="middle">
                  <Col>Employee Celebrations</Col>
                  <Col>
                    <Form.Item
                      name="celebrateEmployees"
                      valuePropName="checked"
                      noStyle
                    >
                      <Switch 
                        onChange={(checked) => setCelebrateEmployees(checked)}
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                This allows all employees to see their peer's life and work events on the Company Overview page.
              </Text>
              
              {celebrateEmployees && (
                <>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Card size="small" title="New Employee">
                        <Form.Item
                          name="newEmployee"
                          valuePropName="checked"
                        >
                          <Checkbox>Last 30 Days</Checkbox>
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" title="Work Anniversary">
                        <Form.Item
                          name="workAnniversary"
                          valuePropName="checked"
                        >
                          <Checkbox>Enable Notifications</Checkbox>
                        </Form.Item>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card size="small" title="Birthdays">
                        <Form.Item
                          name="birthdays"
                          valuePropName="checked"
                        >
                          <Checkbox>Enable Notifications</Checkbox>
                        </Form.Item>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </Card>
          </Col>

          {/* Submit Button */}
          <Col span={24} style={{ textAlign: 'center', marginTop: 24 }}>
            <Button type="primary" size="large" onClick={handleSubmit}>
              Create Company
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CompanyCreateForm; 