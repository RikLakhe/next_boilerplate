import React, { ReactElement, useEffect, useState } from "react";
import { Button, Layout, Menu, Switch, Table, theme, Alert } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

import AdminLayout from "@/client/components/layout/AdminLayout";
import { LayoutPageProps } from "@/types";
import { AdminTitleBanner } from "@/client/components/shared/TitleBanner";
import { MasterDataMenuInterface } from "@/types/menu";
import { MASTER_DATA_MENU_CONFIG } from "@/client/config/menu";
import { MasterDataAppController } from "@/server/modules/masterData/masterData.appController";

import { MASTER_DATA_DROPDOWN } from "@/client/config/masterData";
import { useMasterData } from "@/client/hooks/useMasterData";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { fetchMasterData } from "@/client/store/features/masterData/masterDataAPI.service";
import { setMasterData } from "@/client/store/features/masterData/masterData.slice";
import { MasterData } from "@prisma/client";
import AdminSettingsDrawer from "@/client/components/AdminSettingsDrawer";

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
  initialMasterData: MasterData[];
  initialMasterDataError: string;
}) => {
  const dispatch = useAppDispatch();
  const { masterData } = useMasterData();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState<string>(
    MASTER_DATA_MENU_CONFIG[0].key,
  );

  const [selectedRecord, setSelectedRecord] = useState<MasterData | undefined>(
    undefined,
  );

  const [open, setOpen] = useState(false);

  const showDrawer = (data?: MasterData | undefined) => {
    setSelectedRecord(data);
    setOpen(true);
  };

  const onClose = () => {
    setSelectedRecord(undefined);
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
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => {
        return (
          <Switch
            value={isActive}
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
      render: (record: MasterData) => {
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
          <Table<MasterData>
            columns={renderColumn}
            dataSource={masterData.filter((value) => {
              return value.entityType === selectedKey;
            })}
          />
        </Content>
      </Layout>

      <AdminSettingsDrawer
        selectedRecord={selectedRecord}
        open={open}
        onClose={onClose}
      />
    </>
  );
};

AdminSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminSettingsPage;
