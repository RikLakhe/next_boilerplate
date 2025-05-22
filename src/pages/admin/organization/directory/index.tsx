import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Layout,
  Row,
  Space,
  Table,
  theme,
  Alert,
  notification,
  Select,
} from "antd";
import { Content } from "antd/es/layout/layout";

import AdminLayout from "@/client/components/layout/AdminLayout";
import { LayoutPageProps } from "@/types";
import { AdminTitleBanner } from "@/client/components/shared/TitleBanner";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { UserAppController } from "@/server/modules/users/user.appController";
import { useUserData } from "@/client/hooks/useUserData";
import { setUserData } from "@/client/store/features/directory/user.slice";
import {
  fetchUser,
  storeUser,
  updateUser,
} from "@/client/store/features/directory/userDataAPI.service";
import { User, EmploymentStatus, Area, Designation } from "@prisma/client";
import { EmploymentStatusAppController } from "@/server/modules/employmentStatus/employmentStatus.appController";
import { AreaAppController } from "@/server/modules/areas/area.appController";
import { DesignationAppController } from "@/server/modules/designation/designation.appController";
import { UserDetails } from "@/types/user";

const { Option } = Select;

export async function getServerSideProps() {
  const userAppController = new UserAppController();
  const employmentStatusAppController = new EmploymentStatusAppController();
  const areaAppController = new AreaAppController();
  const designationAppController = new DesignationAppController();

  try {
    const users = await userAppController.findAll();
    const employmentStatus = await employmentStatusAppController.list();
    const areas = await areaAppController.list();
    const designations = await designationAppController.list();

    return {
      props: {
        initialUsers: JSON.parse(JSON.stringify(users)),
        initialEmploymentStatus: JSON.parse(JSON.stringify(employmentStatus)),
        initialAreas: JSON.parse(JSON.stringify(areas)),
        initialDesignations: JSON.parse(JSON.stringify(designations)),
      },
    };
  } catch (error) {
    return {
      props: {
        initialUsers: [],
        initialEmploymentStatus: [],
        initialAreas: [],
        initialDesignations: [],
      },
    };
  }
}

const AdminDirectoryPage: LayoutPageProps = ({
  initialUsers,
  initialEmploymentStatus,
  initialUsersError,
  initialAreas,
  initialDesignations,
}: {
  initialUsers: User[];
  initialEmploymentStatus: EmploymentStatus[];
  initialAreas: Area[];
  initialDesignations: Designation[];
  initialUsersError: string;
}) => {
  const dispatch = useAppDispatch();
  const { userData, loading, error } = useUserData();
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [formError, setFormError] = useState<string | undefined>(undefined);

  const [selectedRecord, setSelectedRecord] = useState<User | undefined>(
    undefined,
  );

  const [open, setOpen] = useState(false);

  const showDrawer = (data?: User | undefined) => {
    setSelectedRecord(data);
    setOpen(true);
  };

  const onClose = () => {
    setSelectedRecord(undefined);
    form.resetFields();
    setOpen(false);
    setFormError(undefined);
  };

  const defaultColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Employment Status",
      key: "currentEmploymentStatus",
      render: (record: UserDetails) => {
        return record.currentEmploymentStatus?.statusName;
      },
    },
    {
      title: "Area",
      key: "currentArea",
      render: (record: UserDetails) => {
        return record.currentArea?.name;
      },
    },
    {
      title: "Designation",
      key: "currentDesignation",
      render: (record: UserDetails) => {
        return record.currentDesignation?.title;
      },
    },
    {
      title: "Manager",
      key: "manager",
      render: (record: UserDetails) => {
        return record.manager?.fullName || "-";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: User) => {
        return (
          <Button
            type="default"
            onClick={() => {
              showDrawer(record);
            }}
          >
            Update
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        id: selectedRecord.id,
        fullName: selectedRecord.fullName,
        email: selectedRecord.email,
        currentEmploymentStatusId: selectedRecord.currentEmploymentStatusId,
        managerId: selectedRecord.managerId,
        currentAreaId: selectedRecord.currentAreaId,
        currentDesignationId: selectedRecord.currentDesignationId,
      });
    } else {
      form.resetFields();
    }
  }, [selectedRecord, form]);

  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) {
      dispatch(setUserData(initialUsers));
    } else {
      dispatch(fetchUser());
    }
  }, [dispatch, initialUsers]);

  return (
    <>
      <AdminTitleBanner
        title="Directory Administration"
        subTitle="Streamlined User Management for your organization"
        buttons={
          <Button
            type="primary"
            onClick={() => {
              showDrawer();
            }}
          >
            + Add User
          </Button>
        }
      />
      {initialUsersError && (
        <Alert message={initialUsersError} type="error" showIcon closable />
      )}
      <Layout
        style={{
          padding: "24px 0",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <Table<User> columns={defaultColumns} dataSource={userData} />
        </Content>
      </Layout>

      <Drawer
        title={selectedRecord ? "Update User" : "Add New User"}
        width={520}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={() => {
                form.submit();
              }}
              type="primary"
              loading={loading}
            >
              Submit
            </Button>
          </Space>
        }
      >
        {(error || formError) && (
          <Alert message={error || formError} type="error" closable closeIcon />
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            const formData = {
              ...values,
            };

            if (selectedRecord) {
              formData.id = selectedRecord.id;
              try {
                await dispatch(updateUser(formData)).unwrap();
                notification.success({
                  message: "User update successful.",
                  placement: "topRight",
                });
                onClose();
              } catch (err) {
                setFormError(err.message);
              }
            } else {
              try {
                await dispatch(storeUser(formData)).unwrap();
                notification.success({
                  message: "User create successful.",
                  placement: "topRight",
                });
                onClose();
              } catch (err) {
                setFormError(err.message);
              }
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: "Please enter e-mail" }]}
              >
                <Input placeholder="Please enter e-mail" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[{ required: true, message: "Please enter e-mail" }]}
              >
                <Input placeholder="Please enter e-mail" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password placeholder="Please enter password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="currentEmploymentStatusId"
                label="Employment Status"
                rules={[
                  {
                    required: true,
                    message: "Please select employment status",
                  },
                ]}
              >
                <Select placeholder="Please select employment status">
                  {initialEmploymentStatus.map((status) => {
                    return (
                      <Option key={status.id} value={status.id}>
                        {status.statusName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currentAreaId"
                label="Area"
                rules={[
                  {
                    required: true,
                    message: "Please select area",
                  },
                ]}
              >
                <Select placeholder="Please select area">
                  {initialAreas.map((area) => {
                    return (
                      <Option key={area.id} value={area.id}>
                        {area.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currentDesignationId"
                label="Designation"
                rules={[
                  {
                    required: true,
                    message: "Please select designation",
                  },
                ]}
              >
                <Select placeholder="Please select designation">
                  {initialDesignations.map((designation) => {
                    return (
                      <Option key={designation.id} value={designation.id}>
                        {designation.title}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="managerId"
                label="Manager"
                rules={[{ required: true, message: "Please select manager" }]}
              >
                <Select placeholder="Please select manager">
                  {initialUsers.map((user) => {
                    return (
                      <Option key={user.id} value={user.id}>
                        {user.fullName}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

AdminDirectoryPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminDirectoryPage;
