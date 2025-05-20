import { NextRequest, NextResponse } from "next/server";
import { LeaveService } from "./leave.service";
import { CreateLeaveDto } from "./dtos/create-leave.dto";
import { UpdateLeaveDto } from "./dtos/update-leave.dto";
import { validateDto } from "@/server/common/utils/validation.util";
import { HttpException } from "@/server/common/exceptions/http-exception";
import logger from "@/server/common/utils/logger.util";
import { getCurrentUser, CurrentUser } from "@/server/common/utils/session.util";

export class LeaveAppController {
  constructor(private readonly leaveService = new LeaveService()) {}

  private validateLeaveAccess(leave: any, currentUser: CurrentUser): void {
    // Admin and HR can access all leaves
    if (currentUser.isAdmin || currentUser.isHR) {
      return;
    }

    // Managers can only access leaves of their team members
    if (currentUser.isManager) {
      if (leave.user_id !== Number(currentUser.id)) {
        throw new HttpException(403, "You can only access leaves of your team members");
      }
      return;
    }

    // Regular users can only access their own leaves
    if (leave.user_id !== Number(currentUser.id)) {
      throw new HttpException(403, "You can only access your own leaves");
    }
  }

  private validateLeaveApproval(leave: any, currentUser: CurrentUser): void {
    // Admin and HR can approve any leave
    if (currentUser.isAdmin || currentUser.isHR) {
      return;
    }

    // Managers can only approve leaves of their team members
    if (currentUser.isManager) {
      if (leave.user_id !== Number(currentUser.id)) {
        throw new HttpException(403, "You can only approve leaves of your team members");
      }
      return;
    }

    // Regular users cannot approve leaves
    throw new HttpException(403, "You don't have permission to approve leaves");
  }

  async GET(request: NextRequest) {
    try {
      const currentUser = await getCurrentUser();
      const searchParams = request.nextUrl.searchParams;
      const id = searchParams.get("id");

      if (id) {
        const leave = await this.leaveService.findOne(Number(id));
        this.validateLeaveAccess(leave, currentUser);
        return NextResponse.json(leave);
      }

      // Admin and HR can see all leaves
      if (currentUser.isAdmin || currentUser.isHR) {
        const leaves = await this.leaveService.findAll();
        return NextResponse.json(leaves);
      }

      // Managers can see leaves of their team members
      if (currentUser.isManager) {
        const leaves = await this.leaveService.findByManagerId(Number(currentUser.id));
        return NextResponse.json(leaves);
      }

      // Regular users can only see their own leaves
      const leaves = await this.leaveService.findByUserId(Number(currentUser.id));
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
      const currentUser = await getCurrentUser();
      const body = await request.json();
      const createLeaveDto = await validateDto(CreateLeaveDto, body);

      // Set created_by from session
      createLeaveDto.createdBy = Number(currentUser.id);

      // Regular users can only create leaves for themselves
      if (!currentUser.isAdmin && !currentUser.isHR) {
        createLeaveDto.userId = Number(currentUser.id);
      }

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
      const currentUser = await getCurrentUser();
      const body = await request.json();
      const updateLeaveDto = await validateDto(UpdateLeaveDto, body);

      // Get existing leave to check permissions
      const existingLeave = await this.leaveService.findOne(updateLeaveDto.id);

      // Set updated_by from session
      updateLeaveDto.updatedBy = Number(currentUser.id);

      // If approving/rejecting, validate approval permissions
      if (updateLeaveDto.status === "approved" || updateLeaveDto.status === "rejected") {
        this.validateLeaveApproval(existingLeave, currentUser);
        updateLeaveDto.approvedBy = Number(currentUser.id);
      } else {
        // For other updates, validate access permissions
        this.validateLeaveAccess(existingLeave, currentUser);
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
