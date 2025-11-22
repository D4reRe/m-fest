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

    // Check if team is already exist
    const existingTeamName = await db.team.findUnique({ where: { name } });
    if (existingTeamName) {
      return NextResponse.json(
        { success: false, error: "This team name is already taken." },
        { status: 400 }
      );
    }

    // Check if all members are registered
    const submittedMemberEmails = members.map((member: Member) => member.email);
    // console.log("Submitted emails: ", submittedMemberEmails);

    const existingUsers = await db.user.findMany({
      where: { email: { in: submittedMemberEmails } },
    });
    // console.log("Existing users based on submitted emails: ", existingUsers);
    if (existingUsers.length !== members.length) {
      return NextResponse.json(
        { success: false, error: "All members must be registered" },
        { status: 400 }
      );
    }

    // ! OLD CODE
    // // Check if all team members are already in a existing team
    // const existingTeamMembers = await db.teamMember.findMany({
    //   where: {
    //     email: {
    //       in: members.map((member: Member) => member.email),
    //     },
    //   },
    // });
    // console.log(
    //   "Existing team members based on submitted emails: ",
    //   existingTeamMembers
    // );

    // // Group members by team id in array of strings with key of string (teamId)
    // const groupedByTeamOfSameTeamMembers = existingTeamMembers.reduce(
    //   (acc, member) => {
    //     acc[member.teamId] = acc[member.teamId] || [];
    //     acc[member.teamId].push(member.email as string);
    //     return acc;
    //   },
    //   {} as Record<string, string[]>
    // );
    // console.log(
    //   "Grouped by team of same team members: ",
    //   groupedByTeamOfSameTeamMembers
    // );

    // const allTeamMembers = await db.teamMember.findMany();
    // console.log("All team members: ", allTeamMembers);

    // const groupedByTeamOfAllTeamMembers = allTeamMembers.reduce(
    //   (acc, member) => {
    //     acc[member.teamId] = acc[member.teamId] || [];
    //     acc[member.teamId].push(member.email as string);
    //     return acc;
    //   },
    //   {} as Record<string, string[]>
    // );
    // console.log(
    //   "Grouped by team of all team members: ",
    //   groupedByTeamOfAllTeamMembers
    // );

    // const teamAlreadyExistsByAllTeamMembers = Object.values(
    //   groupedByTeamOfAllTeamMembers
    // ).some((emails) => {
    //   console.log("All team's Emails: ", emails);
    //   console.log("All Emails total: ", emails.length);
    //   const existingSet = new Set(emails);
    //   const submittedSet = new Set(
    //     members.map((member: Member) => member.email)
    //   );
    //   if (existingSet.size !== submittedSet.size) return false;
    //   for (const email of existingSet) {
    //     if (!submittedSet.has(email)) return false;
    //   }
    //   return true;
    // });

    // if (teamAlreadyExistsByAllTeamMembers) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "All these members are already in the same team.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // // Check if any team already contains *all* of these emails
    // const teamAlreadyExistsBySameTeamMembers = Object.values(
    //   groupedByTeamOfSameTeamMembers
    // ).some((emails) => {
    //   console.log("Existing team's Emails: ", emails);
    //   console.log("Existing team's Emails total: ", emails.length);
    //   const existingSet = new Set(emails);
    //   const submittedSet = new Set(
    //     members.map((member: Member) => member.email)
    //   );
    //   if (existingSet.size !== submittedSet.size) return false;
    //   for (const email of existingSet) {
    //     if (!submittedSet.has(email)) return false;
    //   }
    //   return true;
    // });
    // console.log("Members: ", members);
    // console.log("Members Total: ", members.length);

    // console.log("Team already exists: ", teamAlreadyExistsBySameTeamMembers);

    // if (teamAlreadyExistsBySameTeamMembers) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "All these members are already in the same team.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // ! OLD CODE

    // New Code to check all team members
    const candidateTeams = await db.team.findMany({
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

    const submittedMemberEmailsSet = new Set(submittedMemberEmails);

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

    // console.log("Team already exists or result of checks: ", teamAlreadyExists);

    if (teamAlreadyExists) {
      // console.log("Team already exists");
      return NextResponse.json(
        {
          success: false,
          error: "All these members are already in the same team.",
        },
        { status: 400 }
      );
    }

    // console.log("Team does not already exist, proceed to create team");

    // Check if all members are unique
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
