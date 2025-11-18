import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Member = {
  name: string;
  email: string;
  userId: string;
  institution: string;
  role: "Leader" | "Member";
};

export async function POST(req: Request) {
  const {
    teamName: submittedTeamName,
    userId,
    email,
    members,
    teamId: submittedTeamId,
    leaderName,
    leaderEmail,
    leaderPhoneNumber,
    teamInstitution,
  } = await req.json();
  try {
    const authUser = await prisma.user.findUnique({
      where: { email, id: userId },
    });
    if (!authUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Current team from database
    const existingCurrentTeam = await prisma.team.findUnique({
      where: { id: submittedTeamId },
      include: { members: true },
    });

    console.log("Current team: ", existingCurrentTeam);

    // Check if edited team name is already taken
    console.log("Current existing team name: ", existingCurrentTeam?.name);
    console.log("Submitted team name: ", submittedTeamName);

    if (existingCurrentTeam?.name !== submittedTeamName) {
      const existingTeamName = await prisma.team.findUnique({
        where: {
          name: submittedTeamName,
        },
      });

      if (existingTeamName) {
        console.log("Team name is already taken");
        return NextResponse.json(
          { success: false, error: "This team name is already taken." },
          { status: 400 }
        );
      } else {
        console.log("Team name is available");
      }
    }

    // Check if all members are registered
    const existingSubmittedUsers = await prisma.user.findMany({
      where: { email: { in: members.map((member: Member) => member.email) } },
    });

    const submittedMemberEmails = members.map((member: Member) => member.email);
    console.log("Submitted emails: ", submittedMemberEmails);

    console.log(
      "Existing users based on submitted emails: ",
      existingSubmittedUsers
    );
    if (existingSubmittedUsers.length !== submittedMemberEmails.length) {
      return NextResponse.json(
        { success: false, error: "All members must be registered" },
        { status: 400 }
      );
    }

    // if all member is registered, add userId to submitted members
    const submittedMembers = members.map((member: Member) => {
      return {
        name: member.name,
        email: member.email,
        userId: existingSubmittedUsers.find(
          (user) => user.email === member.email
        )?.id,
        role: member.role,
        institution: member.institution,
      };
    });

    console.log("Submitted members: ", submittedMembers);

    const submittedMemberEmailsSet = new Set(submittedMemberEmails);
    const existingCurrentTeamMembersEmails = new Set(
      existingCurrentTeam?.members.map((member) => member.email)
    );

    // Check if all members are unique
    const submittedMemberProfiles = existingSubmittedUsers.map((user) => {
      return {
        name: user.name,
        email: user.email,
        userId: user.id,
        role: user.role,
        institution: user.institution,
      };
    });
    console.log("Member profiles: ", submittedMemberProfiles);

    // Update team
    const team = await prisma.team.update({
      where: { id: submittedTeamId },
      data: {
        name: submittedTeamName,
        leaderUserId: userId,
        leaderName,
        leaderEmail,
        leaderPhoneNumber,
        teamInstitution,
      },
    });

    console.log("Team updated: ", team);

    // Determined what's changed
    const membersToAdd = submittedMembers.filter(
      (member: Member) => !existingCurrentTeamMembersEmails.has(member.email)
    );
    console.log("Members to add: ", membersToAdd);

    const membersToRemove = existingCurrentTeam?.members.filter(
      (member) => !submittedMemberEmailsSet.has(member.email)
    );
    console.log("Members to remove: ", membersToRemove);

    const membersToUpdate = submittedMembers.filter((member: Member) =>
      existingCurrentTeamMembersEmails.has(member.email)
    );

    // If there's any removal or addition of members, check if team already exists
    if (membersToAdd?.length !== 0 || membersToRemove?.length !== 0) {
      //  Check all team members
      const candidateTeams = await prisma.team.findMany({
        where: {
          members: {
            some: {
              email: {
                in: submittedMemberEmails,
              },
            },
          },
        },
        include: {
          members: true,
        },
      });
      // console.log("Candidate teams: ", candidateTeams);
      // console.log("Candidate teams total: ", candidateTeams.length);
      const teamAlreadyExists = candidateTeams.some((team, index: number) => {
        // console.log("iteration: ", index);
        // console.log("Team: ", team);
        // console.log("Team Members: ", team.members);
        // console.log(
        //   "Existing Team Members Emails: ",
        //   team.members.map((member) => member.email)
        // );
        // console.log(
        //   "Existing Team Members Emails Total: ",
        //   team.members.map((member) => member.email).length
        // );
        // console.log("Submitted member emails: ", submittedMemberEmails);
        // console.log(
        //   "Submitted member emails total: ",
        //   submittedMemberEmails.length
        // );
        const existingTeamMembersEmails = new Set(
          team.members.map((member) => member.email)
        );
        if (existingTeamMembersEmails.size !== submittedMemberEmailsSet.size)
          return false;
        for (const email of existingTeamMembersEmails) {
          if (!submittedMemberEmailsSet.has(email)) return false;
        }
        return true;
      });
      console.log(
        "Team already exists or result of checks: ",
        teamAlreadyExists
      );
      if (teamAlreadyExists) {
        console.log("Team already exists");
        return NextResponse.json(
          {
            success: false,
            error: "All these members are already in the same team.",
          },
          { status: 400 }
        );
      }
      console.log("Team does not already exist, proceed to edit team");
    }

    // Remove old members
    const removeMembers = await prisma.teamMember.deleteMany({
      where: {
        teamId: submittedTeamId,
        email: {
          in: membersToRemove?.map((member) => member.email as string),
        },
      },
    });
    console.log("Remove members: ", removeMembers);
    // Add new members
    const addMembers = await prisma.teamMember.createMany({
      data: membersToAdd.map((member: Member) => ({
        name: member.name,
        email: member.email,
        teamId: submittedTeamId,
        role: member.role,
        institution: member.institution,
        userId:
          member.role === "Leader"
            ? userId
            : member.role === "Member"
              ? submittedMemberProfiles.find(
                  (memberProfile) => memberProfile.email === member.email
                )?.userId
              : undefined,
      })),
    });
    console.log("Add members: ", addMembers);

    console.log("Members to update: ", membersToUpdate);

    const updatedUser = await Promise.all(
      membersToUpdate.map((member: Member) =>
        prisma.teamMember.update({
          where: {
            userId_teamId: {
              userId: member.userId,
              teamId: submittedTeamId,
            },
          },
          data: {
            name: member.name,
            role: member.role,
            email: member.email,
            institution: member.institution,
            userId:
              member.role === "Leader"
                ? userId
                : member.role === "Member"
                  ? submittedMemberProfiles.find(
                      (memberProfile) => memberProfile.email === member.email
                    )?.userId
                  : undefined,
          },
        })
      )
    );

    console.log("Updated user: ", updatedUser);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong when editing team",
        message: error,
      },
      { status: 500 }
    );
  }
}
