import { Button, Alert, Modal, Input, Flex, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { IncomingMessage } from "http";
import MainLayout from "@/app/components/layout/MainLayout";
import TitleBanner from "@/app/components/shared/TitleBanner";
import { UsersService } from "@/server/modules/users/user.service";

// Server-side props
export async function getServerSideProps({ req }: { req: IncomingMessage }) {
  let formError: string | null = null;
  let formSuccess: string | null = null;
  const usersService = new UsersService();

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
      const fullName = formData.get("fullName");
      const email = formData.get("email");
      const password = formData.get("password");
      const employmentStatusId = formData.get("employmentStatusId");

      try {
        await usersService.create({
          fullName: fullName?.toString() || "",
          email: email?.toString() || "",
          passwordHash: password?.toString() || "",
          currentEmploymentStatusId: parseInt(
            employmentStatusId?.toString() || "0",
            10,
          ),
        });

        formSuccess = "User created successfully!";
      } catch (error) {
        formError =
          error instanceof Error ? error.message : "An unknown error occurred";
      }
    }

    if (action === "delete") {
      const id = formData.get("deleteId");
      try {
        if (id) {
          await usersService.remove(parseInt(id, 10));
        } else {
          throw new Error("Invalid ID: ID cannot be null");
        }
        formSuccess = "User deleted successfully!";
      } catch (error) {
        formError =
          error instanceof Error ? error.message : "An unknown error occurred";
      }
    }
  }

  try {
    const users = await usersService.findAll();
    return {
      props: {
        initialUsers: JSON.parse(JSON.stringify(users)),
        formError,
        formSuccess,
      },
    };
  } catch (error) {
    return {
      props: {
        initialUsers: [],
        initialUserError:
          error instanceof Error ? error.message : "An unknown error occurred",
        formError,
        formSuccess,
      },
    };
  }
}

// Updated interface
interface User {
  id: string;
  fullName: string;
  email: string;
}

const Directory = ({
  initialUsers,
  initialUserError,
  formError = "",
}: {
  initialUsers: User[];
  initialUserError: string;
  formError: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [employmentStatusId, setEmploymentStatusId] = useState<
    number | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(formError || "");

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

    if (!fullName || !fullName.trim()) {
      setError("Full Name is required");
      return;
    }

    if (!email || !password || !employmentStatusId) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const form = hiddenFormRef.current;

      if (form) {
        form.action = "/";
        form.fullName.value = fullName;
        form.email.value = email;
        form.password.value = password;
        form.employmentStatusId.value = employmentStatusId.toString();

        const actionInput = form.elements.namedItem(
          "action",
        ) as HTMLInputElement;
        if (actionInput) actionInput.value = "create";

        form.submit();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const form = hiddenFormRef.current;
    if (form) {
      (form.elements.namedItem("action") as HTMLInputElement).value = "delete";
      (form.elements.namedItem("deleteId") as HTMLInputElement).value = id;
      form.submit();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFullName(undefined);
    setEmail(undefined);
    setPassword(undefined);
    setEmploymentStatusId(undefined);
    setError("");
    setLoading(false);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: User) => {
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
        title="Users"
        buttons={
          !initialUserError && (
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Create New User
            </Button>
          )
        }
      />

      {initialUserError && (
        <Alert message={initialUserError} type="error" closable />
      )}

      <Table<User> columns={columns} dataSource={initialUsers} rowKey="id" />

      {!initialUserError && (
        <Modal
          title="Create New User"
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
        >
          {error && <Alert type="error" message={error} showIcon closable />}
          <form onSubmit={handleSubmit}>
            <Flex vertical gap={16}>
              <div>
                <p>Full Name</p>
                <Input
                  name="fullName"
                  size="large"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                />
              </div>
              <div>
                <p>Email</p>
                <Input
                  name="email"
                  type="email"
                  size="large"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div>
                <p>Password</p>
                <Input.Password
                  name="password"
                  size="large"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div>
                <p>Employment Status ID</p>
                <Input
                  name="employmentStatusId"
                  type="number"
                  size="large"
                  placeholder="Enter employment status ID"
                  value={employmentStatusId}
                  onChange={(e) => {
                    setEmploymentStatusId(Number(e.target.value));
                  }}
                />
              </div>
            </Flex>

            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </Button>
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
          </form>
        </Modal>
      )}

      {/* Hidden form for SSR actions */}
      <form
        ref={hiddenFormRef}
        method="POST"
        action="/"
        style={{ display: "none" }}
      >
        <input type="hidden" name="action" value="" />
        <input type="hidden" name="fullName" value="" />
        <input type="hidden" name="email" value="" />
        <input type="hidden" name="password" value="" />
        <input type="hidden" name="employmentStatusId" value="" />
        <input type="hidden" name="deleteId" value="" />
      </form>
    </MainLayout>
  );
};

export default Directory;
