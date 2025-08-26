"use client";

import React, { ReactElement, useState } from "react";
import {
  Form,
  Input,
  Button,
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
  TimePicker,
  Empty,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AdminLayout from "@/client/components/layout/AdminLayout";
import { LayoutPageProps } from "@/types";
import { WorkingWeekData } from "@/types/company";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CompanyUpdatePage: LayoutPageProps = () => {
  const [form] = Form.useForm();
  const [celebrateEmployees, setCelebrateEmployees] = useState(false);
  const [enableCompanyValues, setEnableCompanyValues] = useState(true);

  const defaultStartTime = dayjs().hour(9).minute(0);
  const defaultEndTime = dayjs().hour(17).minute(0);

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(values),
      });
      const result = await response.json();
      if (result.success) {
        message.success(result.message);
      } else {
        message.error(result.message || "Failed to create company");
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const workingWeekColumns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
      width: "20%",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: "15%",
      render: (_: unknown, record: WorkingWeekData) => {
        return (
          <Form.Item
            name={["workingWeek", record.key, "isActive"]}
            valuePropName="checked"
            noStyle
          >
            <Switch
              onChange={(checked) => {
                if (checked) {
                  form.setFieldsValue({
                    workingWeek: {
                      ...form.getFieldValue("workingWeek"),
                      [record.key]: {
                        isActive: true,
                        startTime: defaultStartTime,
                        endTime: defaultEndTime,
                      },
                    },
                  });
                }
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "Working Hours",
      dataIndex: "hours",
      key: "hours",
      width: "65%",
      render: (_: unknown, record: WorkingWeekData) => {
        return (
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => {
              return (
                prevValues?.workingWeek?.[record.key]?.isActive !==
                currentValues?.workingWeek?.[record.key]?.isActive
              );
            }}
          >
            {() => {
              const isActive = form.getFieldValue([
                "workingWeek",
                record.key,
                "isActive",
              ]);
              return isActive ? (
                <Space>
                  <Form.Item
                    name={["workingWeek", record.key, "startTime"]}
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
                    name={["workingWeek", record.key, "endTime"]}
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
        );
      },
    },
  ];

  const workingWeekData: WorkingWeekData[] = [
    {
      key: "monday",
      day: "Monday",
      isActive: true,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
    {
      key: "tuesday",
      day: "Tuesday",
      isActive: true,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
    {
      key: "wednesday",
      day: "Wednesday",
      isActive: true,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
    {
      key: "thursday",
      day: "Thursday",
      isActive: true,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
    {
      key: "friday",
      day: "Friday",
      isActive: true,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
    {
      key: "saturday",
      day: "Saturday",
      isActive: false,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
    {
      key: "sunday",
      day: "Sunday",
      isActive: false,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Update Company Detail</Title>
      <Form form={form} layout="vertical" style={{ marginTop: "24px" }}>
        <Row gutter={[24, 24]}>
          {/* Basic Information Section */}
          <Col span={24}>
            <Card title="Basic Information">
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="companyName"
                    label="Company Name"
                    rules={[
                      { required: true, message: "Please input company name!" },
                    ]}
                  >
                    <Input placeholder="Enter company name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="companyEmail"
                    label="Company Email"
                    rules={[
                      {
                        required: true,
                        message: "Please input company email!",
                      },
                      { type: "email", message: "Please enter a valid email!" },
                    ]}
                  >
                    <Input placeholder="Enter company email" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="missionStatement"
                label="Mission Statement"
                rules={[
                  {
                    required: true,
                    message: "Please input mission statement!",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="Enter mission statement" />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                      { required: true, message: "Please input phone number!" },
                    ]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="website"
                    label="Website"
                    rules={[
                      { required: true, message: "Please input website!" },
                    ]}
                  >
                    <Input placeholder="Enter website URL" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider
                orientation="left"
                style={{ marginTop: 24, marginBottom: 24 }}
              >
                Address
              </Divider>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[
                      { required: true, message: "Please input country!" },
                    ]}
                  >
                    <Input placeholder="Enter country" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="state"
                    label="State/Province"
                    rules={[
                      {
                        required: true,
                        message: "Please input state/province!",
                      },
                    ]}
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
                    rules={[{ required: true, message: "Please input city!" }]}
                  >
                    <Input placeholder="Enter city" />
                  </Form.Item>
                </Col>
                {/* <Col span={12}>
                  <Form.Item
                    name="timezone"
                    label="Timezone"
                    rules={[
                      { required: true, message: "Please select timezone!" },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select timezone"
                      // options={TIMEZONE_OPTIONS}
                      optionFilterProp="label"
                      filterOption={(input, option) => {
                        return (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase());
                      }}
                    />
                  </Form.Item>
                </Col> */}
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
                      initialValue
                      noStyle
                    >
                      <Switch
                        onChange={(checked) => {
                          return setEnableCompanyValues(checked);
                        }}
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 16 }}
              >
                Company values are useful for shaping the culture and supporting
                the vision of your company. Employees can tag company values
                when giving feedback.
              </Text>

              {enableCompanyValues && (
                <Form.List name="companyValues">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.length === 0 && (
                          <Empty
                            description="No company values yet. Add your first value to get started!"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{ margin: "32px 0" }}
                          />
                        )}
                        {fields.map(({ key, name, ...restField }) => {
                          return (
                            <Row
                              key={key}
                              gutter={[16, 16]}
                              align="top"
                              style={{ marginBottom: 24 }}
                            >
                              {/* <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "category"]}
                                  label="Category"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Select category",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Select category"
                                    options={VALUE_CATEGORIES}
                                  />
                                </Form.Item>
                              </Col> */}
                              <Col span={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "value"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing value",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Enter company value" />
                                </Form.Item>
                              </Col>
                              <Col span={14}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "description"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Missing description",
                                    },
                                  ]}
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
                                  onClick={() => {
                                    return remove(name);
                                  }}
                                  style={{ marginTop: 4 }}
                                />
                              </Col>
                            </Row>
                          );
                        })}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => {
                              return add();
                            }}
                            block
                            icon={<PlusOutlined />}
                            style={{ marginTop: 16 }}
                          >
                            Add Company Value
                          </Button>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
              )}
            </Card>
          </Col>

          {/* Company Settings Section */}
          <Col span={24}>
            <Card title="Company Settings">
              <Divider orientation="left">Working Week</Divider>
              <Form.Item
                name="workingWeek"
                initialValue={workingWeekData.reduce((acc, day) => {
                  return {
                    ...acc,
                    [day.key]: {
                      isActive: day.isActive,
                      startTime: day.startTime,
                      endTime: day.endTime,
                    },
                  };
                }, {})}
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
                        onChange={(checked) => {
                          return setCelebrateEmployees(checked);
                        }}
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Text
                type="secondary"
                style={{ display: "block", marginBottom: 16 }}
              >
                This allows all employees to see their peer&apos;s life and work
                events on the Company Overview page.
              </Text>

              {celebrateEmployees && (
                <Row gutter={24}>
                  <Col span={8}>
                    <Card size="small" title="New Employee">
                      <Form.Item name="newEmployee" valuePropName="checked">
                        <Checkbox>Last 30 Days</Checkbox>
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="Work Anniversary">
                      <Form.Item name="workAnniversary" valuePropName="checked">
                        <Checkbox>Enable Notifications</Checkbox>
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="Birthdays">
                      <Form.Item name="birthdays" valuePropName="checked">
                        <Checkbox>Enable Notifications</Checkbox>
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>

          {/* Submit Button */}
          <Col span={24} style={{ textAlign: "center", marginTop: 24 }}>
            <Button type="primary" size="large" onClick={handleSubmit}>
              Submit
            </Button>
            <Button type="default" size="large" onClick={handleSubmit}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

CompanyUpdatePage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CompanyUpdatePage;
