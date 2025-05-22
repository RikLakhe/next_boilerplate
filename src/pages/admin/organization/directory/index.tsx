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
} from "antd";
import { Content } from "antd/es/layout/layout";

import AdminLayout from "@/app/components/layout/AdminLayout";
import { LayoutPageProps } from "@/types";
import { AdminTitleBanner } from "@/app/components/shared/TitleBanner";
import { useAppDispatch } from "@/app/hooks/useAppDispatch";
import { UserAppController } from "@/server/modules/users/user.appController";
import { UserProps } from "@/types/user";
import { useUserData } from "@/app/hooks/useUserData";
import { setUserData } from "@/app/store/features/directory/user.slice";
import {
  fetchUser,
  storeUser,
  updateUser,
} from "@/app/store/features/directory/userDataAPI.service";

export async function getServerSideProps() {
  const userAppController = new UserAppController();

  try {
    const users = await userAppController.findAll();

    return {
      props: {
        initialUsers: users,
      },
    };
  } catch (error) {
    return {
      props: {
        initialUsers: [],
      },
    };
  }
}

const AdminDirectoryPage: LayoutPageProps = ({
  initialUsers,
  initialUsersError,
}: {
  initialUsers: UserProps[];
  initialUsersError: string;
}) => {
  const dispatch = useAppDispatch();
  const { userData, loading, error } = useUserData();
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [formError, setFormError] = useState<string | undefined>(undefined);

  const [selectedRecord, setSelectedRecord] = useState<UserProps | undefined>(
    undefined,
  );

  const [open, setOpen] = useState(false);

  const showDrawer = (data?: UserProps | undefined) => {
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
      title: "Action",
      key: "action",
      render: (record: UserProps) => {
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
        title="User Settings"
        subTitle="Manage User"
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
          <Table<UserProps> columns={defaultColumns} dataSource={userData} />
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

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true, message: "Please enter password" }]}
                >
                  <Input.Password placeholder="Please enter password" />
                </Form.Item>
              </Col>
            </Row>
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
