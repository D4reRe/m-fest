import { db } from "@/server/db";
import { NextResponse } from "next/server";

type Member = {
  name: string;
  email: string;
  institution: string;
  role: "Leader" | "Member";
};

export async function POST(req: Request) {
  const {
    name,
    userId,
    email,
    members,
    leaderName,
    leaderEmail,
    leaderPhoneNumber,
    teamInstitution,
  } = await req.json();
  try {
    const authUser = await db.user.findUnique({
      where: { email, id: userId },
    });
    if (!authUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if team name is already exist
    const existingTeamName = await db.team.findUnique({ where: { name } });
    if (existingTeamName) {
      return NextResponse.json(
        { success: false, error: "This team name is already taken." },
        { status: 400 }
      );
    }

    // !! Since every user can only have 1 registration, we don't need to check if creating a new team, must consist of many combination of users that are different from existing teams
    // Check if all members are registered
    // const submittedMemberEmails = members.map((member: Member) => member.email);
    // console.log("Submitted emails: ", submittedMemberEmails);

    // const existingUsers = await db.user.findMany({
    //   where: { email: { in: submittedMemberEmails } },
    // });
    // console.log("Existing users based on submitted emails: ", existingUsers);
    // if (existingUsers.length !== members.length) {
    //   return NextResponse.json(
    //     { success: false, error: "All members must be registered" },
    //     { status: 400 }
    //   );
    // }

    // const candidateTeams = await db.team.findMany({
    //   where: {
    //     members: {
    //       some: {
    //         email: {
    //           in: submittedMemberEmails,
    //         },
    //       },
    //     },
    //   },
    //   include: {
    //     members: true,
    //   },
    // });
    // console.log("Candidate teams: ", candidateTeams);
    // console.log("Candidate teams total: ", candidateTeams.length);

    // const submittedMemberEmailsSet = new Set(submittedMemberEmails);

    // const teamAlreadyExists = candidateTeams.some((team, index: number) => {
    //   console.log("iteration: ", index);
    //   console.log("Team: ", team);
    //   console.log("Team Members: ", team.members);
    //   console.log(
    //     "Existing Team Members Emails: ",
    //     team.members.map((member) => member.email)
    //   );
    //   console.log(
    //     "Existing Team Members Emails Total: ",
    //     team.members.map((member) => member.email).length
    //   );
    //   console.log("Submitted member emails: ", submittedMemberEmails);
    //   console.log(
    //     "Submitted member emails total: ",
    //     submittedMemberEmails.length
    //   );
    //   const existingTeamMembersEmails = new Set(
    //     team.members.map((member) => member.email)
    //   );
    //   if (existingTeamMembersEmails.size !== submittedMemberEmailsSet.size)
    //     return false;
    //   for (const email of existingTeamMembersEmails) {
    //     if (!submittedMemberEmailsSet.has(email)) return false;
    //   }
    //   return true;
    // });

    // console.log("Team already exists or result of checks: ", teamAlreadyExists);

    // if (teamAlreadyExists) {
    //   console.log("Team already exists");
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "All these members are already in the same team.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // console.log("Team does not already exist, proceed to create team");

    // Just creating some variables that are established from previous code
    const submittedMemberEmails = members.map((member: Member) => member.email);
    const existingUsers = await db.user.findMany({
      where: { email: { in: submittedMemberEmails } },
    });

    const memberProfiles = existingUsers.map((user) => {
      return {
        email: user.email,
        userId: user.id,
      };
    });
    // console.log("Member profiles: ", memberProfiles);

    // Create team
    const team = await db.team.create({
      data: {
        name,
        leaderUserId: userId,
        leaderName,
        leaderEmail,
        leaderPhoneNumber,
        teamInstitution,
      },
    });

    // Create team members
    const teamMembers = await db.teamMember.createMany({
      data: members.map((member: Member) => ({
        name: member.name,
        email: member.email,
        institution: member.institution,
        teamId: team.id,
        role: member.role,
        userId:
          member.role === "Leader"
            ? userId
            : member.role === "Member"
              ? memberProfiles.find(
                  (memberProfile) => memberProfile.email === member.email
                )?.userId
              : undefined,
      })),
    });

    // console.log("Team created: ", team);
    // console.log("Team members created: ", teamMembers);
    // console.log("Team Successfully created!");

    return NextResponse.json(
      { success: true, teamId: team.id, teamMembers },
      { status: 200 }
    );
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong when creating team",
        message: error,
      },
      { status: 500 }
    );
  }
}
