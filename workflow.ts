import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Gdrive_root_sweeper_guide
// Nodes   : 4  |  Connections: 2
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// SetupInstructions                  stickyNote
// TriggerEveryDayAt3am               scheduleTrigger
// FindRootFiles                      googleDrive                [creds]
// MoveToSweeperFolder                googleDrive                [creds]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// TriggerEveryDayAt3am
//    → FindRootFiles
//      → MoveToSweeperFolder
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'MDNIQCx6UzO85VDw',
    name: 'Gdrive_root_sweeper_guide',
    active: false,
    settings: {
        executionOrder: 'v1',
        availableInMCP: false,
        timeSavedMode: 'fixed',
        callerPolicy: 'workflowsFromSameOwner',
    },
})
export class GdriveRootSweeperGuideWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '43143cb8-a20a-475f-8136-1b9b72527579',
        name: 'Setup Instructions',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [0, 0],
    })
    SetupInstructions = {
        content: `## 🚀 Quick Start Guide

**Step 1: Connect Google Drive**
(Required if you are new to n8n)
1. Double-click the node named **'Find Root Files'**.
2. In the 'Credentials' section, click the dropdown and select **Create New**.
3. Choose **Google Drive OAuth2 API**.
4. Follow the prompts to sign in with your Google account.

---

**Step 2: Set Destination Folder**
The node **'Move to Sweeper folder'** uses a variable for the destination.
* **Best Practice:** Go to *Settings > Environment Variables* and add \`SWEEPER_FOLDER_ID\` with your folder's ID.
* **Quick Fix:** Open the node, delete the text \`{{ $env... }}\`, and simply select a folder from the 'List' view.`,
        height: 420,
        width: 450,
        color: 4,
    };

    @node({
        id: 'a707513b-d7c2-4821-8db2-6a00d07e64e1',
        name: 'Trigger: Every Day at 3AM',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.1,
        position: [64, 480],
    })
    TriggerEveryDayAt3am = {
        rule: {
            interval: [
                {
                    triggerAtHour: 3,
                },
            ],
        },
    };

    @node({
        id: 'a172948a-8ead-4f15-9f25-bda1e065b22c',
        name: 'Find Root Files',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [288, 480],
        credentials: { googleDriveOAuth2Api: { id: '', name: 'Google Drive account' } },
    })
    FindRootFiles = {
        resource: 'fileFolder',
        searchMethod: 'query',
        queryString: "='root' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false",
        returnAll: true,
        filter: {
            whatToSearch: 'files',
        },
        options: {
            fields: ['id', 'name'],
        },
    };

    @node({
        id: 'a1435d3c-e161-4ff2-9d85-6213c4acf8d5',
        name: 'Move to Sweeper folder',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [512, 480],
        credentials: { googleDriveOAuth2Api: { id: '', name: 'Google Drive account' } },
    })
    MoveToSweeperFolder = {
        operation: 'move',
        fileId: '={{ $json.id }}',
        driveId: {
            __rl: true,
            mode: 'list',
            value: 'My Drive',
        },
        folderId: '={{ $env.SWEEPER_FOLDER_ID }}',
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.TriggerEveryDayAt3am.out(0).to(this.FindRootFiles.in(0));
        this.FindRootFiles.out(0).to(this.MoveToSweeperFolder.in(0));
    }
}
