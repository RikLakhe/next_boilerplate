import React, { ReactElement, useEffect, useState } from "react";

import AdminLayout from "@/app/components/layout/AdminLayout";
import { LayoutPageProps } from "@/types";
import {
  Button,
  Col,
  ColorPicker,
  Drawer,
  Form,
  Input,
  Layout,
  Menu,
  Row,
  Select,
  Space,
  Switch,
  Table,
  theme,
  Alert,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { AdminTitleBanner } from "@/app/components/shared/TitleBanner";
import { MasterDataMenuInterface } from "@/types/menu";
import { MASTER_DATA_MENU_CONFIG } from "@/app/config/menu";
import { MasterDataAppController } from "@/server/modules/masterData/masterData.appController";
import { MasterDataProps } from "@/types/masterData";
import { MASTER_DATA_DROPDOWN } from "@/app/config/masterData";
import { useMasterData } from "@/app/hooks/useMasterData";
import { useAppDispatch } from "@/app/hooks/useAppDispatch";
import {
  fetchMasterData,
  storeMasterData,
  updateMasterData,
} from "@/app/store/features/masterData/masterDataAPI.service";
import { setMasterData } from "@/app/store/features/masterData/masterData.slice";

const { Option } = Select;

export async function getServerSideProps() {
  const masterDataAppController = new MasterDataAppController();

  try {
    const masterData = await masterDataAppController.listByEntity();

    return {
      props: {
        initialMasterData: masterData,
      },
    };
  } catch (error) {
    return {
      props: {
        initialMasterData: [],
      },
    };
  }
}

const AdminSettingsPage: LayoutPageProps = ({
  initialMasterData,
  initialMasterDataError,
}: {
  initialMasterData: MasterDataProps[];
  initialMasterDataError: string;
}) => {
  const dispatch = useAppDispatch();
  const { masterData, loading, error } = useMasterData();
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [entityType, setEntityType] = useState<string | undefined>(undefined);
  const [selectedKey, setSelectedKey] = useState<string>(
    MASTER_DATA_MENU_CONFIG[0].key,
  );

  const [selectedRecord, setSelectedRecord] = useState<
    MasterDataProps | undefined
  >(undefined);

  const [open, setOpen] = useState(false);

  const showDrawer = (data?: MasterDataProps | undefined) => {
    setSelectedRecord(data);
    setOpen(true);
  };

  const onClose = () => {
    setSelectedRecord(undefined);
    form.resetFields();
    setOpen(false);
  };

  const renderMenuItems = (items: MasterDataMenuInterface[]) => {
    return items.map((item) => {
      if (item.key.includes("divider")) {
        return <Menu.Divider key={item.key} />;
      }

      if (item.subMenu) {
        return (
          <Menu.SubMenu key={item.key} title={item.label}>
            {renderMenuItems(item.subMenu)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.key}
          onClick={() => {
            setSelectedKey(item.key);
          }}
        >
          {item.label}
        </Menu.Item>
      );
    });
  };

  const defaultColumns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
  ];

  const renderColumn = [
    ...defaultColumns,
    ...(MASTER_DATA_DROPDOWN.filter((item) => {
      return item.color;
    })
      .map((item) => {
        return item.key;
      })
      .includes(selectedKey)
      ? [
          {
            title: "Color",
            dataIndex: "color",
            key: "color",
            render: (color: string) => {
              return (
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    backgroundColor: color,
                    color: "#fff",
                    borderRadius: "4px",
                  }}
                >
                  {color}
                </span>
              );
            },
          },
        ]
      : []),
    {
      title: "Is Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean) => {
        return (
          <Switch
            value={is_active}
            onClick={() => {}}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
            style={{
              cursor: "default",
            }}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: MasterDataProps) => {
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

  // Reset form fields when selectedRecord changes
  useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        entity_type: selectedRecord.entity_type,
        code: selectedRecord.code,
        label: selectedRecord.label,
        color: selectedRecord.color,
        is_active: selectedRecord.is_active,
      });

      setEntityType(selectedRecord.entity_type);
    } else {
      form.resetFields();
      setEntityType(undefined);
    }
  }, [selectedRecord, form]);

  useEffect(() => {
    if (initialMasterData && initialMasterData.length > 0) {
      dispatch(setMasterData(initialMasterData));
    } else {
      dispatch(fetchMasterData());
    }
  }, [dispatch, initialMasterData]);

  return (
    <>
      <AdminTitleBanner
        title="Master Data Settings"
        subTitle="Manage your master data settings here."
        buttons={
          <Button
            type="primary"
            onClick={() => {
              showDrawer();
            }}
          >
            + Add Master Data
          </Button>
        }
      />
      {initialMasterDataError && (
        <Alert
          message={initialMasterDataError}
          type="error"
          showIcon
          closable
        />
      )}
      <Layout
        style={{
          padding: "24px 0",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Sider width={200}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%" }}
          >
            {renderMenuItems(MASTER_DATA_MENU_CONFIG)}
          </Menu>
        </Sider>
        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <Table<MasterDataProps>
            columns={renderColumn}
            dataSource={masterData.filter((value) => {
              return value.entity_type === selectedKey;
            })}
          />
        </Content>
      </Layout>

      <Drawer
        title={selectedRecord ? "Update Master Data" : "Add New Master Data"}
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
        {error && <Alert message={error} type="error" closable closeIcon />}
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if (changedValues.entity_type) {
              setEntityType(changedValues.entity_type);
            }
          }}
          onFinish={async (values) => {
            const formData = {
              ...values,
              color:
                typeof values.color === "string"
                  ? values.color
                  : values.color?.toHexString(),
            };
            if (selectedRecord) {
              formData.id = selectedRecord.id;
              dispatch(updateMasterData(formData));
            } else {
              dispatch(storeMasterData(formData));
            }
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="entity_type"
                label="Entity"
                rules={[
                  { required: true, message: "Please choose the entity" },
                ]}
              >
                <Select placeholder="Please choose the entity">
                  {MASTER_DATA_DROPDOWN.map((item) => {
                    return (
                      <Option value={item.key} key={item.key}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: "Please enter code" }]}
              >
                <Input placeholder="Please enter code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="label"
                label="Label"
                rules={[{ required: true, message: "Please enter label" }]}
              >
                <Input placeholder="Please enter label" />
              </Form.Item>
            </Col>
          </Row>
          {entityType &&
            MASTER_DATA_DROPDOWN.filter((item) => {
              return item.color;
            })
              .map((item) => {
                return item.key;
              })
              .includes(entityType) && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="color"
                    label="Color"
                    rules={[{ required: true, message: "Please select color" }]}
                  >
                    <ColorPicker
                      defaultValue="#ffff"
                      format="hex"
                      showText={(color) => {
                        return <span>({color.toHexString()})</span>;
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          {selectedRecord && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="is_active" label="Is Active">
                  <Switch
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Drawer>
    </>
  );
};

AdminSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminSettingsPage;
