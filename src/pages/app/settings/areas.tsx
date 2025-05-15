import { AreasService } from "@/server/modules/areas/area.service";
import { Button, Alert, Modal, Input, Flex, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { IncomingMessage } from "http";
import MainLayout from "@/app/components/layout/MainLayout";
import TitleBanner from "@/app/components/shared/TitleBanner";

export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  let formError: string | null = null;
  let formSuccess: string | null = null;
  // Fetch ALL data needed for the page on the server
  const areasService = new AreasService();

  if (req.method === "POST") {
    // Parse form data
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

    // Handle create operation
    // Handle create operation
    if (action === "create") {
      const name = formData.get("areaName");
      const description = formData.get("areaDescription");
      try {
        await areasService.create({
          name: name || "",
          description: description || "",
        });

        formSuccess = "Item updated successfully!";
      } catch (error) {
        formError =
          error instanceof Error ? error.message : "An unknown error occurred";
      }
    }

    // Handle delete operation
    if (action === "delete") {
      const id = formData.get("deleteId");
      try {
        if (id) {
          await areasService.remove(parseInt(id, 10));
        } else {
          throw new Error("Invalid ID: ID cannot be null");
        }
        formSuccess = "Item deleted successfully!";
      } catch (error) {
        formError =
          error instanceof Error ? error.message : "An unknown error occurred";
      }
    }
  }

  try {
    const areas = await areasService.findAll();

    return {
      props: {
        initialArea: JSON.parse(JSON.stringify(areas)),
        formError,
        formSuccess,
      },
    };
  } catch (error) {
    return {
      props: {
        initialArea: [],
        initialAreaError:
          error instanceof Error ? error.message : "An unknown error occurred",
        formError,
        formSuccess,
      },
    };
  }
}

interface Area {
  id: string;
  name: string;
  description: string;
}

const Areas = ({
  initialArea,
  initialAreaError,
  formError = "",
}: {
  initialArea: Area[];
  initialAreaError: string;
  formError: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [areaName, setAreaName] = useState<string | undefined>(undefined);
  const [areaDescription, setAreaDescription] = useState<string | undefined>(
    undefined,
  );
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
    if (!areaName || !areaName.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);

    try {
      // Set values to the hidden form
      if (hiddenFormRef.current) {
        const form = hiddenFormRef.current;

        if (form) {
          const actionInput = form.elements.namedItem(
            "action",
          ) as HTMLInputElement;
          if (actionInput) {
            actionInput.value = "create";
          }
        }
        form.areaName.value = areaName;
        form.areaDescription.value = areaDescription;
        // Submit the form directly
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
    setAreaName(undefined);
    setAreaDescription(undefined);
    setError("");
    setLoading(false);
    if (hiddenFormRef.current) {
      const form = hiddenFormRef.current;
      form.action = "";
      form.areaName.value = "";
      form.areaDescription.value = "";
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Area) => {
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
        title="Areas"
        buttons={
          !initialAreaError && (
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Create New Area
            </Button>
          )
        }
      />

      {initialAreaError && (
        <Alert message={initialAreaError} type="error" closable />
      )}

      <Table<Area> columns={columns} dataSource={initialArea} />

      {!initialAreaError && (
        <Modal
          title="Create New Area"
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          {error && <Alert type="error" message={error} showIcon closable />}

          <form onSubmit={handleSubmit}>
            <Flex vertical gap={16}>
              <div>
                <p>Area Name</p>
                <Input
                  name="areaName"
                  size="large"
                  placeholder="Enter name of the area"
                  onChange={(e) => {
                    setAreaName(e.target.value);
                  }}
                  value={areaName}
                />
              </div>
              <div>
                <p>Area Description</p>
                <Input
                  name="areaDescription"
                  size="large"
                  placeholder="Description of the area"
                  onChange={(e) => {
                    setAreaDescription(e.target.value);
                  }}
                  value={areaDescription}
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
        <input type="hidden" name="areaName" value="" />
        <input type="hidden" name="areaDescription" value="" />
        <input type="hidden" name="deleteId" value="" />
        <input type="hidden" name="itemId" value="" />
      </form>
    </MainLayout>
  );
};

export default Areas;
