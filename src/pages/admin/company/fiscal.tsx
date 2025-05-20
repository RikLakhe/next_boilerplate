import { ReactElement, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";

import AdminLayout from "@/app/components/layout/AdminLayout";
import { AdminTitleBanner } from "@/app/components/shared/TitleBanner";
import { useAppDispatch } from "@/app/hooks/useAppDispatch";

import { EventsAppController } from "@/server/modules/events/events.appController";
import { EventsAppProps } from "@/types/calendar";

export async function getServerSideProps() {
  const eventsAppController = new EventsAppController();

  try {
    const events = await eventsAppController.list();

    return {
      props: {
        initialFiscalYear: JSON.parse(JSON.stringify(events)),
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
  initialFiscalYear: EventsAppProps[];
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>(
    undefined,
  );

  console.log(
    "%csrc/pages/admin/company/fiscal.tsx:63 initialFiscalYear",
    "color: #007acc;",
    initialFiscalYear,
    formError,
    dispatch,
  );

  const onModelOpen = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const onModelClose = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedEventId(undefined);
    setFormError(undefined);
  };

  const column = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
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
      render: (_: unknown, record: EventsAppProps) => {
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedEventId(record.id);
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
        <Table<EventsAppProps> columns={column} dataSource={[]} />
      </Card>

      <Modal
        title={selectedEventId ? "Update Fiscal Year" : "Add New Fiscal Year"}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            const formData = {
              ...values,
              startDate: new Date(values.startEndTime[0]),
              endDate: new Date(values.startEndTime[1]),
              createdBy: 1,
            };

            console.log(
              "%csrc/pages/admin/company/fiscal.tsx:190 formData",
              "color: #007acc;",
              formData,
            );

            // if (selectedEventId) {
            //   formData.id = selectedEventId;
            //   try {
            //     await dispatch(updateEvents(formData)).unwrap();
            //     notification.success({
            //       message: "Event update successful.",
            //       placement: "topRight",
            //     });
            //     onClose();
            //   } catch (err) {
            //     setFormError(err.message);
            //   }
            // } else {
            //   try {
            //     await dispatch(storeEvents(formData)).unwrap();
            //     notification.success({
            //       message: "Event create successful.",
            //       placement: "topRight",
            //     });
            //     onClose();
            //   } catch (err) {
            //     setFormError(err.message);
            //   }
            // }
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
