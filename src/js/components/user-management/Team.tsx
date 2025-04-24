// import { useRoles } from '@/context/roles';

// import { Checkbox } from '@/components/ui/Checkbox';
// import { Select, SelectItem } from '@/components/ui/Select';

// import { Team as TeamType, Workspace } from '@/api-integration/types/user-management';

// interface WorkspaceTeams {
//   workspace: Workspace;
//   handleTeamCheckboxChange: (workspaceId: string, team: TeamType) => void;
//   extendedWorkspacesTeams: {
//     id: string;
//     title: string;
//     roleType: string | undefined;
//   }[];
//   updateRoleType: (workspaceId: string, teamId: string | null, newRoleType: string) => void;
//   team: TeamType;
// }

// const Team = ({
//   workspace,
//   handleTeamCheckboxChange,
//   extendedWorkspacesTeams,
//   updateRoleType,
//   team
// }: WorkspaceTeams) => {
//   const { roles } = useRoles('team');

//   const isChecked = extendedWorkspacesTeams.filter((t) => t.id == team.id).length > 0;

//   return (
//     <div className="grid grid-cols-[3fr,2fr] items-center px-3 py-1">
//       <div className="ml-24 flex gap-4 p-2">
//         <Checkbox
//           checked={isChecked}
//           onValueChange={() => handleTeamCheckboxChange(workspace.id, team)}
//         />

//         <div className="flex items-center gap-3">
//           <p className="text-md font-medium">{team.title}</p>
//         </div>
//       </div>

//       {/* team role */}
//       <div className="flex w-full items-center justify-end gap-4">
//         <p className="whitespace-nowrap text-sm font-medium">Team Role: </p>
//         <Select
//           className="w-32"
//           isDisabled={!isChecked}
//           placeholder="Select role"
//           aria-label={'Select role'}
//           onChange={(e) => updateRoleType(workspace.id, team.id, e.target.value)}
//         >
//           {roles && roles.length > 0 ? (
//             roles.map((role) => <SelectItem key={role.id}>{role.title}</SelectItem>)
//           ) : (
//             <SelectItem key="No roles">No roles</SelectItem>
//           )}
//         </Select>
//       </div>
//     </div>
//   );
// };

// export default Team;
