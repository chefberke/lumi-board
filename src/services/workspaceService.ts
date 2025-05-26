import { KanbanWorkspace } from "@/stores/kanbanStore";

export async function getAllWorkspacesWithTasks(): Promise<KanbanWorkspace[]> {
  try {
    const workspacesResponse = await fetch('http://localhost:3000/api/workspaces/getWorkspaces', {
      method: 'GET',
    });

    if (!workspacesResponse.ok) {
      throw new Error(`Failed to fetch workspaces: ${workspacesResponse.status}`);
    }

    const workspacesData = await workspacesResponse.json();
    const workspaces = workspacesData.workspaces || [];

    const workspacesWithTasks = await Promise.all(
      workspaces.map(async (workspace: any) => {
        try {
          const detailResponse = await fetch(`/api/workspaces/${workspace._id}`, {
            method: 'GET',
          });

          if (!detailResponse.ok) {
            console.error(`Failed to fetch workspace ${workspace._id} details`);
            return null;
          }

          const detailData = await detailResponse.json();
          return detailData.workspace;
        } catch (error) {
          console.error(`Error fetching workspace ${workspace._id} details:`, error);
          return null;
        }
      })
    );

    return workspacesWithTasks.filter(Boolean) as KanbanWorkspace[];
  } catch (error) {
    console.error('Error fetching all workspaces with tasks:', error);
    return [];
  }
}
