import { Button, Alert, Modal, Input, Flex, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import MainLayout from "@/app/components/layout/MainLayout";
import TitleBanner from "@/app/components/shared/TitleBanner";
import { GetServerSideProps } from "next";

// eslint-disable-next-line react-refresh/only-export-components

// eslint-disable-next-line import/no-extraneous-dependencies
import cookie from "cookie";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  const cookies = cookie.parse(req.headers.cookie || "");

  const sessionToken = cookies["next-auth.session-token"];
  const csrfToken = cookies["next-auth.csrf-token"];

  const headers = {
    "Content-Type": "application/json",
    Cookie: `next-auth.session-token=${sessionToken}; next-auth.csrf-token=${csrfToken}`,
  };

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/designation`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch designations");
  }

  const data = await res.json();

  return {
    props: {
      designations: data,
    },
  };
};

interface Designation {
  id: string;
  title: string;
  description: string;
}

const Designations = ({
  designations,
  initialError,
}: {
  designations: Designation[];
  initialError: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designationName, setDesignationName] = useState<string | undefined>(
    undefined,
  );
  const [areaDescription, setAreaDescription] = useState<string | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
  const [_, setError] = useState("");

  // Hidden form reference for direct form submission
  const hiddenFormRef = useRef<HTMLFormElement>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Client-side validation
    if (!designationName || !designationName.trim()) {
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
        form.designationName.value = designationName;
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
    setDesignationName(undefined);
    setAreaDescription(undefined);
    setError("");
    setLoading(false);
    if (hiddenFormRef.current) {
      const form = hiddenFormRef.current;
      form.action = "";
      form.designationName.value = "";
      form.areaDescription.value = "";
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Designation) => {
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
        title="Desinations"
        buttons={
          !initialError && (
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

      {initialError && <Alert message={initialError} type="error" closable />}

      <Table<Designation> columns={columns} dataSource={designations} />

      {!initialError && (
        <Modal
          title="Create New Area"
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          {initialError && (
            <Alert type="error" message={initialError} showIcon closable />
          )}

          <form onSubmit={handleSubmit}>
            <Flex vertical gap={16}>
              <div>
                <p>Area Name</p>
                <Input
                  name="designationName"
                  size="large"
                  placeholder="Enter name of the area"
                  onChange={(e) => {
                    setDesignationName(e.target.value);
                  }}
                  value={designationName}
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
        <input type="hidden" name="designationName" value="" />
        <input type="hidden" name="areaDescription" value="" />
        <input type="hidden" name="deleteId" value="" />
        <input type="hidden" name="itemId" value="" />
      </form>
    </MainLayout>
  );
};

export default Designations;
