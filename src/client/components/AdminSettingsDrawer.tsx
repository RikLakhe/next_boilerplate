import { MasterData } from "@prisma/client";
import {
  Alert,
  Button,
  Col,
  ColorPicker,
  Drawer,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useMasterData } from "../hooks/useMasterData";
import {
  storeMasterData,
  updateMasterData,
} from "../store/features/masterData/masterDataAPI.service";
import { MASTER_DATA_DROPDOWN } from "../config/masterData";

const { Option } = Select;

const AdminSettingsDrawer = ({
  selectedRecord,
  onClose,
  open,
}: {
  selectedRecord: MasterData | undefined;
  onClose: () => void;
  open: boolean;
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { loading, error } = useMasterData();

  const [entityType, setEntityType] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleDrawerClose = () => {
    setFormError(undefined);
    onClose();
  };

  useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        entityType: selectedRecord.entityType,
        code: selectedRecord.code,
        label: selectedRecord.label,
        color: selectedRecord.color,
        isActive: selectedRecord.isActive,
      });

      setEntityType(selectedRecord.entityType);
    } else {
      form.resetFields();
      setEntityType(undefined);
    }
  }, [selectedRecord, form]);

  return (
    <Drawer
      title={selectedRecord ? "Update Master Data" : "Add New Master Data"}
      width={520}
      onClose={handleDrawerClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={handleDrawerClose}>Cancel</Button>
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
        onValuesChange={(changedValues) => {
          if (changedValues.entityType) {
            setEntityType(changedValues.entityType);
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
            try {
              await dispatch(updateMasterData(formData)).unwrap();
              notification.success({
                message: "Master Data update successful.",
                placement: "topRight",
              });
              handleDrawerClose();
            } catch (err) {
              setFormError(err.message);
            }
          } else {
            try {
              await dispatch(storeMasterData(formData)).unwrap();
              notification.success({
                message: "Master Data create successful.",
                placement: "topRight",
              });
              handleDrawerClose();
            } catch (err) {
              setFormError(err.message);
            }
          }
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="entityType"
              label="Entity"
              rules={[{ required: true, message: "Please choose the entity" }]}
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
              <Form.Item name="isActive" label="Is Active">
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
  );
};

export default AdminSettingsDrawer;
