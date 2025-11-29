"use server";
import { db } from "@/server/db";
import { getUserProfile } from "./user.action";
import { type User } from "@/types/types";

export async function getRegisteredTeams() {
  const user = (await getUserProfile()) as User;

  const [
    userTeams,
    userTeamMembers,
    userRegisteredCompetitions,
    allRegisteredTeamDatas,
    allTeamsDatas,
    allTeamMembersDatas,
  ] = await Promise.all([
    db.team.findMany({
      where: { members: { some: { userId: user.id } } },
      include: { members: true },
    }),
    db.teamMember.findMany({
      where: { userId: user.id },
      include: { team: true, user: true },
    }),
    db.compRegistration.findMany({
      where: { userId: user.id },
      include: { team: true },
    }),
    db.compRegistration.findMany({
      select: { teamId: true },
    }),
    db.team.findMany({
      select: {
        id: true,
        competition: true,
      },
    }),
    db.teamMember.findMany({
      select: {
        email: true,
        teamId: true,
        userId: true,
        role: true,
      },
    }),
  ]);

  const userRegisteredTeams = userRegisteredCompetitions.map(
    (competition) => competition.teamId
  );
  // console.log("Registered teams: ", userRegisteredTeams);
  const userAvailableTeams = userTeams.filter(
    (team) => !userRegisteredTeams.includes(team.id)
  );
  const userAsLeaderTeams = userAvailableTeams.filter((team) => {
    return userTeamMembers.some((member) => {
      return member.teamId === team.id && member.role === "Leader";
    });
  });

  const teamNames = userAsLeaderTeams.map((team) => team.name);

  // STEM
  const userAsLeaderTeamsForStem = userAvailableTeams.filter((team) => {
    const totalMembers = team.members.length;
    return userTeamMembers.some((member) => {
      return (
        member.teamId === team.id &&
        member.role === "Leader" &&
        totalMembers === 3
      );
    });
  });

  const stemTeamNames = userAsLeaderTeamsForStem.map((team) => team.name);

  return {
    userRegisteredTeams,
    userAvailableTeams,
    userAsLeaderTeams,
    teamNames,
    stemTeamNames,
    allRegisteredTeamDatas,
    allTeamsDatas,
    allTeamMembersDatas,
    userTeams,
    userTeamMembers,
    userRegisteredCompetitions,
  };
}
