import { ReactElement, useState } from "react";
import {
  Button,
  Carousel,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";

import AdminLayout from "@/client/components/layout/AdminLayout";
import { AdminTitleBanner } from "@/client/components/shared/TitleBanner";

const { Option } = Select;

const NoticesPage = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AdminTitleBanner
        title="Notice Administration"
        subTitle="Manage and organize notice effectively"
        buttons={
          <Button
            size="large"
            type="primary"
            className="!rounded-lg !px-6 !py-2 !text-sm"
            onClick={() => {
              showDrawer();
            }}
          >
            Create Notice
          </Button>
        }
      />
      <Drawer
        title="Create a new Notice"
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
            <Button onClick={onClose} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter user name" }]}
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="url"
                label="Url"
                rules={[{ required: true, message: "Please enter url" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  addonBefore="http://"
                  addonAfter=".com"
                  placeholder="Please enter url"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="owner"
                label="Owner"
                rules={[{ required: true, message: "Please select an owner" }]}
              >
                <Select placeholder="Please select an owner">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: "Please choose the type" }]}
              >
                <Select placeholder="Please choose the type">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="approver"
                label="Approver"
                rules={[
                  { required: true, message: "Please choose the approver" },
                ]}
              >
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[
                  { required: true, message: "Please choose the dateTime" },
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
                    message: "please enter url description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter url description"
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

NoticesPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default NoticesPage;
