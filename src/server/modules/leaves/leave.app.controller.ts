import { NextRequest, NextResponse } from "next/server";
import { LeaveService } from "./leave.service";
import { CreateLeaveDto } from "./dtos/create-leave.dto";
import { UpdateLeaveDto } from "./dtos/update-leave.dto";
import { validateDto } from "@/server/common/utils/validation.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { getCurrentUser } from "@/server/common/utils/session.util";

export class LeaveAppController {
  constructor(private readonly leaveService = new LeaveService()) {}

  async GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams;
      const id = searchParams.get("id");

      if (id) {
        const leave = await this.leaveService.findOne(Number(id));
        return NextResponse.json(leave);
      }

      const leaves = await this.leaveService.findAll();
      return NextResponse.json(leaves);
    } catch (error) {
      if (error instanceof HttpException) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode },
        );
      }
      logger.error("Error in GET /api/leaves:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  }

  async POST(request: NextRequest) {
    try {
      const body = await request.json();
      const createLeaveDto = await validateDto(CreateLeaveDto, body);

      // Get current user from session
      const currentUser = await getCurrentUser();

      // Set created_by from session
      createLeaveDto.createdBy = currentUser.id;

      const leave = await this.leaveService.create(createLeaveDto);
      return NextResponse.json(leave, { status: 201 });
    } catch (error) {
      if (error instanceof HttpException) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode },
        );
      }
      logger.error("Error in POST /api/leaves:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  }

  async PUT(request: NextRequest) {
    try {
      const body = await request.json();
      const updateLeaveDto = await validateDto(UpdateLeaveDto, body);

      // Get current user from session
      const currentUser = await getCurrentUser();

      // Set updated_by from session
      updateLeaveDto.updatedBy = currentUser.id;

      // If approving/rejecting, set approved_by from session
      if (updateLeaveDto.status === "approved" || updateLeaveDto.status === "rejected") {
        updateLeaveDto.approvedBy = currentUser.id;
      }

      const leave = await this.leaveService.update(updateLeaveDto.id, updateLeaveDto);
      return NextResponse.json(leave);
    } catch (error) {
      if (error instanceof HttpException) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode },
        );
      }
      logger.error("Error in PUT /api/leaves:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  }
}
