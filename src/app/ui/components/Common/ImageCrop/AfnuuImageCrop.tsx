/* eslint-disable */
// @ts-nocheck

import ImgCrop from "antd-img-crop";
import React, { useRef } from "react";
import type { UploadFile } from "antd";
import { Button, Modal, Upload } from "antd";
import { EditFilled, PlusOutlined } from "@ant-design/icons";

interface ImageCropperProps {
  uploadedFile: UploadFile[];
  setUploadedFile: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  fetchImageUrl: (url: string) => void;
  handleToRemoveLogo: () => void;
  toggleRemoveFile: boolean;
  setToggleRemoveFile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleRemoveFileModal: () => void;
  agentUserLogoUploadLoading: boolean;
}

const AfnuuImageCrop = (props: ImageCropperProps) => {
  const {
    uploadedFile,
    setUploadedFile,
    fetchImageUrl,
    handleToRemoveLogo,
    toggleRemoveFile,
    setToggleRemoveFile,
    toggleRemoveFileModal,
    agentUserLogoUploadLoading,
  } = props;

  const inputRef = useRef<null | HTMLButtonElement>(null);

  return (
    <div className="image_crop_container">
      <ImgCrop aspect={128 / 31} showReset rotationSlider modalOk="Upload">
        <Upload
          listType="picture-card"
          accept="image/*"
          fileList={uploadedFile}
          maxCount={1}
          showUploadList={{
            showPreviewIcon: true,
            previewIcon: <EditFilled />,
          }}
          onPreview={() => {
            if (inputRef?.current) {
              inputRef?.current.click();
            }
          }}
          onRemove={() => {
            setToggleRemoveFile(true);
            return false;
          }}
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              fetchImageUrl(reader.result as string);
              setUploadedFile([
                { uid: "", name: "", url: reader.result as string },
              ]);
            };
            return false;
          }}
        >
          <Button
            className={`btn-primary main-upload-btn ${
              uploadedFile.length > 0 ? "none" : "show"
            }`}
            ref={inputRef}
          >
            <PlusOutlined /> Upload Logo
          </Button>
        </Upload>
      </ImgCrop>

      <Modal
        open={toggleRemoveFile}
        onCancel={toggleRemoveFileModal}
        title="Delete Logo"
        onOk={handleToRemoveLogo}
        confirmLoading={agentUserLogoUploadLoading}
      >
        <p>Do you want to delete the logo?</p>
      </Modal>
    </div>
  );
};
export default AfnuuImageCrop;
