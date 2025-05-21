import { ReactElement } from "react";
import { Col, Row, Space, Card, Typography, Tag, Table, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import AdminLayout from "@/app/components/layout/AdminLayout";
import { AdminTitleBanner } from "@/app/components/shared/TitleBanner";
import Image from "next/image";
import { useRouter } from "next/router";
import { LayoutPageProps } from "@/types";

const { Title, Paragraph } = Typography;

// Fake data
const fakeCompanyData = {
  timezone: "America/Los_Angeles",
  companyValues: [
    {
      category: "innovation",
      value: "Innovation First",
      description:
        "We embrace change and continuously seek new ways to solve problems.",
    },
    {
      category: "teamwork",
      value: "Collaborative Excellence",
      description:
        "We believe in the power of working together to achieve extraordinary results.",
    },
    {
      category: "integrity",
      value: "Ethical Leadership",
      description:
        "We conduct our business with the highest standards of integrity and transparency.",
    },
  ],
  workingWeek: {
    monday: {
      isActive: true,
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(17).minute(0),
    },
    tuesday: {
      isActive: true,
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(17).minute(0),
    },
    wednesday: {
      isActive: true,
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(17).minute(0),
    },
    thursday: {
      isActive: true,
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(17).minute(0),
    },
    friday: {
      isActive: true,
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(17).minute(0),
    },
    saturday: { isActive: false, startTime: null, endTime: null },
    sunday: { isActive: false, startTime: null, endTime: null },
  },
  celebrateEmployees: true,
  newEmployee: true,
  workAnniversary: true,
  birthdays: true,
};

const CompanyGeneralPage: LayoutPageProps = () => {
  const router = useRouter();

  const workingWeekColumns = [
    {
      title: "Day",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Working" : "Not Working"}
          </Tag>
        );
      },
    },
    {
      title: "Working Hours",
      dataIndex: "hours",
      key: "hours",
      render: (
        _: unknown,
        record: {
          isActive: boolean;
          startTime: dayjs.Dayjs | null;
          endTime: dayjs.Dayjs | null;
        },
      ) => {
        if (!record.isActive) return "N/A";
        return record.startTime && record.endTime
          ? `${record.startTime.format("h:mm A")} - ${record.endTime.format("h:mm A")}`
          : "N/A";
      },
    },
  ];

  const workingWeekData = Object.entries(fakeCompanyData.workingWeek).map(
    ([key, value]) => {
      return {
        key,
        day: key.charAt(0).toUpperCase() + key.slice(1),
        ...value,
      };
    },
  );

  return (
    <div>
      <AdminTitleBanner
        title="Company Administration"
        subTitle="Manage Company details."
        buttons={
          <Button
            type="primary"
            onClick={() => {
              router.push("/admin/company/update");
            }}
          >
            Update Company Details
          </Button>
        }
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card>
              <Row gutter={24} align="middle">
                <Col span={4}>
                  <Image
                    src="/logo_aricalot.webp"
                    alt="Company Logo"
                    width={100}
                    height={100}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </Col>
                <Col span={20}>
                  <Title level={2}>Aricalot</Title>
                  <Space direction="vertical" size="small">
                    <Space>
                      <MailOutlined /> info@aricalot.com
                    </Space>
                    <Space>
                      <PhoneOutlined /> +977 1 453 5813
                    </Space>
                    <Space>
                      <GlobalOutlined /> https://aricalot.com/
                    </Space>
                    <Space>
                      <EnvironmentOutlined />
                      Lamtangeen Marg, Baluwatar, Kathmandu, Nepal
                    </Space>
                    <Space>
                      <ClockCircleOutlined /> {fakeCompanyData.timezone}
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Mission Statement">
              <Paragraph>
                At Aricalot, our foundation is rooted in the belief that strong
                relationships are built upon trust, reliability, and exceptional
                quality. We pride ourselves on the enduring connections we
                establish with our customers through the consistent delivery of
                top-tier products. Every product we offer is a testament to our
                dedication to quality craftsmanship, meticulous attention to
                detail, and unwavering commitment to meeting and surpassing our
                customers&apos; expectations. We understand that each
                interaction is an opportunity to strengthen our relationships,
                and we strive to earn your trust by consistently delivering
                exceptional value, reliability, and superior quality in
                everything we do. Your satisfaction is not just our goal;
                it&apos;s the cornerstone of the relationships we build.
              </Paragraph>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Company Values">
              <Row gutter={[16, 16]}>
                {fakeCompanyData.companyValues.map((value) => {
                  return (
                    <Col span={8} key={value.value}>
                      <Card size="small" title={value.value}>
                        <Tag color="blue">{value.category}</Tag>
                        <Paragraph style={{ marginTop: 8 }}>
                          {value.description}
                        </Paragraph>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </Col>

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

          {/* Employee Celebrations */}
          <Col span={24}>
            <Card
              title={
                <Space>
                  <GiftOutlined />
                  Employee Celebrations
                  <Tag
                    color={fakeCompanyData.celebrateEmployees ? "green" : "red"}
                  >
                    {fakeCompanyData.celebrateEmployees
                      ? "Enabled"
                      : "Disabled"}
                  </Tag>
                </Space>
              }
            >
              {fakeCompanyData.celebrateEmployees && (
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size="small" title="New Employee">
                      <Tag
                        color={
                          fakeCompanyData.newEmployee ? "green" : "default"
                        }
                      >
                        {fakeCompanyData.newEmployee
                          ? "Last 30 Days"
                          : "Disabled"}
                      </Tag>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="Work Anniversary">
                      <Tag
                        color={
                          fakeCompanyData.workAnniversary ? "green" : "default"
                        }
                      >
                        {fakeCompanyData.workAnniversary
                          ? "Enabled"
                          : "Disabled"}
                      </Tag>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small" title="Birthdays">
                      <Tag
                        color={fakeCompanyData.birthdays ? "green" : "default"}
                      >
                        {fakeCompanyData.birthdays ? "Enabled" : "Disabled"}
                      </Tag>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

CompanyGeneralPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CompanyGeneralPage;
