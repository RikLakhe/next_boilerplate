import {
  Button,
  Alert,
  Input,
  Table,
  Form,
  notification,
  Drawer,
  Space,
  Row,
  Col,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ReactElement, useEffect, useState } from "react";

import { DepartmentDetail } from "@/types/department";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { useDepartment } from "@/client/hooks/useDepartment";
import { setDepartment } from "@/client/store/features/department/department.slice";
import {
  fetchDepartment,
  storeDepartment,
  updateDepartment,
} from "@/client/store/features/department/departmentAPI.service";
import AdminLayout from "@/client/components/layout/AdminLayout";
import TitleBanner from "@/client/components/shared/TitleBanner";
import { DepartmentAppController } from "@/server/modules/departments/department.appController";

export async function getServerSideProps() {
  const departmentsService = new DepartmentAppController();

  try {
    const departments = await departmentsService.list();

    return {
      props: {
        initialDepartment: JSON.parse(JSON.stringify(departments)),
      },
    };
  } catch (error) {
    return {
      props: {
        initialDepartment: [],
      },
    };
  }
}

const Departments = ({
  initialDepartment,
  initialDepartmentError,
}: {
  initialDepartment: DepartmentDetail[];
  initialDepartmentError: string;
}) => {
  const dispatch = useAppDispatch();
  const { department, loading, error } = useDepartment();
  const [form] = Form.useForm();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<
    DepartmentDetail | undefined
  >(undefined);

  const showDrawer = (data?: DepartmentDetail | undefined) => {
    setSelectedRecord(data);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedRecord(undefined);
    form.resetFields();
    setIsDrawerOpen(false);
    setFormError(undefined);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "departmentName",
      key: "departmentName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Department Manager",
      dataIndex: "departmentManagerId",
      key: "departmentManagerId",
      render: (_: unknown, record: DepartmentDetail) => {
        return record.departmentManager?.fullName;
      },
    },
    {
      title: "Department Members",
      key: "departmentMembers",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: DepartmentDetail) => {
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
        departmentName: selectedRecord.departmentName,
        description: selectedRecord.description,
        departmentManagerId: selectedRecord.departmentManagerId,
      });
    } else {
      form.resetFields();
    }
  }, [selectedRecord, form]);

  useEffect(() => {
    if (initialDepartment && initialDepartment.length > 0) {
      dispatch(setDepartment(initialDepartment));
    } else {
      dispatch(fetchDepartment());
    }
  }, [dispatch, initialDepartment]);

  return (
    <>
      <TitleBanner
        title="Departments"
        buttons={
          !initialDepartmentError && (
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => {
                showDrawer();
              }}
            >
              Create New Department
            </Button>
          )
        }
      />

      {initialDepartmentError && (
        <Alert message={initialDepartmentError} type="error" closable />
      )}

      <Card>
        <Table<DepartmentDetail> columns={columns} dataSource={department} />
      </Card>

      {!initialDepartmentError && (
        <Drawer
          title={selectedRecord ? "Update Department" : "Create New Department"}
          width={520}
          open={isDrawerOpen}
          onClose={closeDrawer}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
        >
          {(error || formError) && (
            <Alert
              type="error"
              message={error || formError}
              showIcon
              closable
            />
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              const formData = {
                ...values,
                departmentManagerId: Number(values.departmentManagerId),
              };

              if (selectedRecord) {
                formData.id = Number(selectedRecord.id);
                try {
                  await dispatch(updateDepartment(formData)).unwrap();
                  notification.success({
                    message: "Department update successful.",
                    placement: "topRight",
                  });
                  closeDrawer();
                } catch (err) {
                  setFormError(err.message);
                }
              } else {
                try {
                  await dispatch(storeDepartment(formData)).unwrap();
                  notification.success({
                    message: "Department create successful.",
                    placement: "topRight",
                  });
                  closeDrawer();
                } catch (err) {
                  setFormError(err.message);
                }
              }
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="departmentName"
                  label="Department Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter name of department",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter name of the department"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Department Description"
                  rules={[
                    {
                      required: true,
                      message: "Please enter  description of department",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Description of the department"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="departmentManagerId"
                  label="Manager ID"
                  rules={[
                    {
                      required: true,
                      message: "Please enter department ID",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Enter Manager ID" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Space>
                  <Button
                    onClick={() => {
                      form.submit();
                    }}
                    type="primary"
                    loading={loading}
                  >
                    {selectedRecord ? "Update" : "Add"}
                  </Button>
                  <Button type="default" onClick={closeDrawer}>
                    Cancel
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Drawer>
      )}
    </>
  );
};

Departments.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Departments;
