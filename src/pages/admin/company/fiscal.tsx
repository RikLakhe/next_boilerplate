import { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space,
  Table,
  Alert,
} from "antd";
import { ColumnType } from "antd/es/table";
import dayjs from "dayjs";

import AdminLayout from "@/app/components/layout/AdminLayout";
import { AdminTitleBanner } from "@/app/components/shared/TitleBanner";
import { useAppDispatch } from "@/app/hooks/useAppDispatch";

import { FiscalYearAppController } from "@/server/modules/fiscalYear/fiscalYear.appController";
import { FiscalYear } from "@prisma/client";
import {
  fetchFiscalYear,
  storeFiscalYear,
  updateFiscalYear,
} from "@/app/store/features/fiscalYear/fiscalAPI.service";
import { setFiscalYear } from "@/app/store/features/fiscalYear/fiscal.slice";
import { useFiscalYear } from "@/app/hooks/useFiscalYear";

export async function getServerSideProps() {
  const fiscalYearAppController = new FiscalYearAppController();

  try {
    const fiscalYears = await fiscalYearAppController.list();

    return {
      props: {
        initialFiscalYear: JSON.parse(JSON.stringify(fiscalYears)),
      },
    };
  } catch (error) {
    return {
      props: {
        initialFiscalYear: [],
      },
    };
  }
}

const FiscalPage = ({
  initialFiscalYear,
}: {
  initialFiscalYear: FiscalYear[];
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { fiscalYear } = useFiscalYear();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [selectedFiscalYearId, setSelectedFiscalYearId] = useState<
    number | undefined
  >(undefined);

  const onModelOpen = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const onModelClose = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedFiscalYearId(undefined);
    setFormError(undefined);
  };

  const column: ColumnType<FiscalYear>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate: string) => {
        return dayjs(startDate).format("YYYY-MM-DD");
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate: string) => {
        return dayjs(endDate).format("YYYY-MM-DD");
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: FiscalYear) => {
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedFiscalYearId(record.id);
                form.setFieldsValue({
                  ...record,
                  startEndTime: [
                    dayjs(record.startDate),
                    dayjs(record.endDate),
                  ],
                });
              }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                // Implement your delete logic here, e.g. dispatch(deleteEvent(record.id))
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (initialFiscalYear && initialFiscalYear.length > 0) {
      dispatch(setFiscalYear(initialFiscalYear));
    } else {
      dispatch(fetchFiscalYear());
    }
  }, [dispatch, initialFiscalYear]);

  return (
    <div>
      <AdminTitleBanner
        title="Fiscal Year Administration"
        subTitle="Manage your organization's fiscal years, including start and end dates, types, and descriptions."
        buttons={
          <Button
            size="large"
            type="primary"
            className="!rounded-lg !px-6 !py-2 !text-sm"
            onClick={() => {
              onModelOpen();
            }}
          >
            Add New Fiscal Year
          </Button>
        }
      />
      <Card>
        <Table<FiscalYear> columns={column} dataSource={fiscalYear} />
      </Card>

      <Modal
        title={
          selectedFiscalYearId ? "Update Fiscal Year" : "Add New Fiscal Year"
        }
        open={isModalOpen}
        footer={[
          <Button onClick={onModelClose} key="Cancel">
            Cancel
          </Button>,
          <Button
            key="Submit"
            onClick={() => {
              form.submit();
              // onClose();
            }}
            type="primary"
            loading={false}
          >
            Submit
          </Button>,
        ]}
        onCancel={onModelClose}
      >
        {formError && <Alert message={formError} type="error" closable />}
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            const formData = {
              ...values,
              startDate: new Date(values.startEndTime[0]),
              endDate: new Date(values.startEndTime[1]),
            };

            delete formData.startEndTime;

            if (selectedFiscalYearId) {
              formData.id = selectedFiscalYearId;
              try {
                await dispatch(updateFiscalYear(formData)).unwrap();
                notification.success({
                  message: "Event update successful.",
                  placement: "topRight",
                });
                onModelClose();
              } catch (err) {
                setFormError(err.message);
              }
            } else {
              try {
                await dispatch(storeFiscalYear(formData)).unwrap();
                notification.success({
                  message: "Event create successful.",
                  placement: "topRight",
                });
                onModelClose();
              } catch (err) {
                setFormError(err.message);
              }
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Fiscal Year Name"
                rules={[
                  { required: true, message: "Please enter Fiscal Year name" },
                ]}
              >
                <Input placeholder="Please enter Fiscal Year name." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="startEndTime"
                label="Start and End Time"
                rules={[
                  {
                    required: true,
                    message: "Please choose the event start and end time",
                  },
                ]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  getPopupContainer={(trigger) => {
                    return trigger.parentElement!;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "please enter description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter description"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

FiscalPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default FiscalPage;
