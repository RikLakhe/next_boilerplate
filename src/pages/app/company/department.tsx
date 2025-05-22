import { DepartmentService } from "@/server/modules/departments/department.service";
import { Button, Alert, Modal, Input, Flex, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { IncomingMessage } from "http";
import MainLayout from "@/app/components/layout/MainLayout";
import TitleBanner from "@/app/components/shared/TitleBanner";

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  let formError: string | null = null;
  let formSuccess: string | null = null;
  const departmentsService = new DepartmentService();

  if (req.method === "POST") {
    const body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        resolve(data);
      });
      req.on("error", reject);
    });

    const formData = new URLSearchParams(body);
    const action = formData.get("action");

    if (action === "create") {
      const name = formData.get("departmentName");
      const description = formData.get("description");
      try {
        await departmentsService.create({
          departmentName: name || "",
          description: description || "",
        });

        formSuccess = "Item updated successfully!";
      } catch (error) {
        formError =
          error instanceof Error ? error.message : "An unknown error occurred";
      }
    }
  }

  try {
    const departments = await departmentsService.findAll();

    return {
      props: {
        initialDepartment: JSON.parse(JSON.stringify(departments)),
        formError,
        formSuccess,
      },
    };
  } catch (error) {
    return {
      props: {
        initialDepartment: [],
        initialDepartmentError:
          error instanceof Error ? error.message : "An unknown error occurred",
        formError,
        formSuccess,
      },
    };
  }
}

interface Department {
  id: string;
  departmentName: string;
  description: string;
}

const Departments = ({
  initialDepartment,
  initialDepartmentError,
  formError = "",
}: {
  initialDepartment: Department[];
  initialDepartmentError: string;
  formError: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState<string | undefined>(
    undefined,
  );
  const [departmentDescription, setDepartmentDescription] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(formError || "");

  // Hidden form reference for direct form submission
  const hiddenFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formError) {
      setIsModalOpen(true);
    }
  }, [formError]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Client-side validation
    if (!departmentName || !departmentName.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);

    try {
      // Set values to the hidden form
      if (hiddenFormRef.current) {
        const form = hiddenFormRef.current;

        if (form) {
          form.action = "/";
          form.departmentName.value = departmentName;
          form.description.value = departmentDescription;
          const actionInput = form.elements.namedItem(
            "action",
          ) as HTMLInputElement;
          if (actionInput) {
            actionInput.value = "create";
          }
        }
        form.submit();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const form = hiddenFormRef.current;

    if (form) {
      const actionInput = form.elements.namedItem("action") as HTMLInputElement;
      if (actionInput) {
        actionInput.value = "delete";
      }

      form.deleteId.value = id;
      form.submit();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDepartmentName("");
    setDepartmentDescription("");
    setError("");
    setLoading(false);
    if (hiddenFormRef.current) {
      const form = hiddenFormRef.current;
      form.action = "";
      form.departmentName.value = "";
      form.description.value = "";
    }
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
      title: "Action",
      key: "action",
      render: (_: unknown, record: Department) => {
        return (
          <Button
            type="primary"
            danger
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <TitleBanner
        title="Department"
        buttons={
          !initialDepartmentError && (
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Create New Department
            </Button>
          )
        }
      />

      {initialDepartmentError && (
        <Alert message={initialDepartmentError} type="error" closable />
      )}

      <Table<Department> columns={columns} dataSource={initialDepartment} />

      {!initialDepartmentError && (
        <Modal
          title="Create New Department"
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          {error && <Alert type="error" message={error} showIcon closable />}

          <form onSubmit={handleSubmit}>
            <Flex vertical gap={16}>
              <div>
                <p>Department Name</p>
                <Input
                  name="departmentName"
                  size="large"
                  placeholder="Enter name of the department"
                  onChange={(e) => {
                    setDepartmentName(e.target.value);
                  }}
                  value={departmentName}
                />
              </div>
              <div>
                <p>Department Description</p>
                <Input
                  name="description"
                  size="large"
                  placeholder="Description of the department"
                  onChange={(e) => {
                    setDepartmentDescription(e.target.value);
                  }}
                  value={departmentDescription}
                />
              </div>
            </Flex>

            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
          </form>
        </Modal>
      )}

      {/* Hidden form for server-side operations */}
      <form
        ref={hiddenFormRef}
        method="POST"
        action="/"
        style={{ display: "none" }}
      >
        <input type="hidden" name="action" value="" />
        <input type="hidden" name="departmentName" value="" />
        <input type="hidden" name="description" value="" />
        <input type="hidden" name="deleteId" value="" />
        <input type="hidden" name="itemId" value="" />
      </form>
    </MainLayout>
  );
};

export default Departments;
