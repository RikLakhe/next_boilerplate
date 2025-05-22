import { ReactElement, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Carousel,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";

import AdminLayout from "@/client/components/layout/AdminLayout";
import { AdminTitleBanner } from "@/client/components/shared/TitleBanner";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { useMasterData } from "@/client/hooks/useMasterData";
import { EventsAppController } from "@/server/modules/events/events.appController";
import { EventsAppProps } from "@/types/calendar";
import { setEvents } from "@/client/store/features/events/events.slice";
import {
  fetchEvents,
  storeEvents,
  updateEvents,
} from "@/client/store/features/events/eventsAPI.service";
import { MasterDataAppController } from "@/server/modules/masterData/masterData.appController";
import { setMasterData } from "@/client/store/features/masterData/masterData.slice";
import { fetchMasterData } from "@/client/store/features/masterData/masterDataAPI.service";
import { useEvents } from "@/client/hooks/useEvents";
import { MasterData } from "@prisma/client";

const { Option } = Select;

export async function getServerSideProps() {
  const eventsAppController = new EventsAppController();
  const masterDataAppController = new MasterDataAppController();

  try {
    const events = await eventsAppController.list();
    const masterData = await masterDataAppController.listByEntity("event");

    return {
      props: {
        initialEvents: JSON.parse(JSON.stringify(events)),
        initialMasterData: masterData,
      },
    };
  } catch (error) {
    return {
      props: {
        initialEvents: [],
        initialMasterData: [],
      },
    };
  }
}

const EventsPage = ({
  initialEvents,
  initialMasterData,
}: {
  initialEvents: EventsAppProps[];
  initialMasterData: MasterData[];
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { masterData } = useMasterData();
  const { events, error, loading } = useEvents();
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>(
    undefined,
  );

  const showDrawer = () => {
    setOpen(true);
    form.resetFields();
  };

  const onClose = () => {
    setOpen(false);
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
      title: "Type",
      dataIndex: "eventType",
      key: "eventType",
      render: (eventType: MasterData) => {
        return (
          <span
            style={{
              backgroundColor: eventType.color || "#e6f7ff",
              color: "#222",
              borderRadius: "4px",
              padding: "2px 8px",
              display: "inline-block",
            }}
          >
            {eventType.label}
          </span>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => {
        const maxLength = 50;
        if (!description) return "";
        return description.length > maxLength
          ? `${description.slice(0, maxLength)}...`
          : description;
      },
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
                setOpen(true);
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

  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      dispatch(setEvents(initialEvents));
    } else {
      dispatch(fetchEvents());
    }
  }, [dispatch, initialEvents]);

  useEffect(() => {
    if (initialMasterData && initialMasterData.length > 0) {
      dispatch(setMasterData(initialMasterData));
    } else {
      dispatch(fetchMasterData());
    }
  }, [dispatch, initialMasterData]);

  return (
    <div>
      <AdminTitleBanner
        title="Events Administration"
        subTitle="Create and manage company events and HR programs. Calendar admins can create and manage events and share them out to specific roles to view on the company calendar."
        buttons={
          <Button
            size="large"
            type="primary"
            className="!rounded-lg !px-6 !py-2 !text-sm"
            onClick={() => {
              showDrawer();
            }}
          >
            Create Event
          </Button>
        }
      />

      <Card>
        <Table<EventsAppProps> columns={column} dataSource={events} />
      </Card>
      <Drawer
        title={selectedEventId ? "Update Event" : "Create a new Event"}
        width={720}
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
                // onClose();
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
              startDate: new Date(values.startEndTime[0]),
              endDate: new Date(values.startEndTime[1]),
              createdBy: 1,
            };

            delete formData.startEndTime;

            if (selectedEventId) {
              formData.id = selectedEventId;
              try {
                await dispatch(updateEvents(formData)).unwrap();
                notification.success({
                  message: "Event update successful.",
                  placement: "topRight",
                });
                onClose();
              } catch (err) {
                setFormError(err.message);
              }
            } else {
              try {
                await dispatch(storeEvents(formData)).unwrap();
                notification.success({
                  message: "Event create successful.",
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
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: "Please enter event title" },
                ]}
              >
                <Input placeholder="Please enter event title." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="eventTypeCode"
                label="Event Type"
                rules={[
                  { required: true, message: "Please choose the event type" },
                ]}
              >
                <Select placeholder="Please choose the event type">
                  {masterData
                    .filter((singleMasterData) => {
                      return (
                        singleMasterData.entityType === "event" &&
                        singleMasterData.isActive
                      );
                    })
                    .map((singleMasterData) => {
                      return (
                        <Option
                          key={singleMasterData.code}
                          value={singleMasterData.code}
                        >
                          {singleMasterData.label}
                        </Option>
                      );
                    })}
                </Select>
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
                    message: "please enter event description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter event description"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Carousel autoplay>
                <div>
                  <h3
                    style={{
                      height: "160px",
                      color: "#fff",
                      lineHeight: "160px",
                      textAlign: "center",
                      background: "#364d79",
                    }}
                  >
                    Events bring people together and foster collaboration.
                  </h3>
                </div>
                <div>
                  <h3
                    style={{
                      height: "160px",
                      color: "#fff",
                      lineHeight: "160px",
                      textAlign: "center",
                      background: "#364d79",
                    }}
                  >
                    Well-organized events boost engagement and morale.
                  </h3>
                </div>
                <div>
                  <h3
                    style={{
                      height: "160px",
                      color: "#fff",
                      lineHeight: "160px",
                      textAlign: "center",
                      background: "#364d79",
                    }}
                  >
                    Tips: Define clear goals, plan ahead, and communicate
                    effectively.
                  </h3>
                </div>
                <div>
                  <h3
                    style={{
                      height: "160px",
                      color: "#fff",
                      lineHeight: "160px",
                      textAlign: "center",
                      background: "#364d79",
                    }}
                  >
                    Use this platform to create, manage, and share events
                    seamlessly.
                  </h3>
                </div>
              </Carousel>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

EventsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default EventsPage;
