import React, { Component } from "react";
import TreeDisplay from "../treeDisplay/TreeDisplay";
import TreeEditor from "../treeEditor/TreeEditor";
import { Container, Grid, Paper } from "@material-ui/core";
import { TreeNode, TreeNodeRaw, convertTreeNodeToRaw } from "../../models/TreeNode";

type MainState = {
    treeRoots: TreeNode[],
    initialTreeRoots?: TreeNodeRaw[],
}

export default class Main extends Component<any, MainState> {

    state: MainState = {
        treeRoots: [],
    }

    saveBackupTimeoutHandle?: any;

    componentDidMount() {
        const treeNodesText = window.localStorage.getItem("treeNodes");
        if (treeNodesText) {
            const initialTreeRoots = JSON.parse(treeNodesText) as TreeNodeRaw[] || [];
            this.setState({
                initialTreeRoots,
            })
        }
    }

    render() {
        return <>
            {/* <Container fixed maxWidth="xl"> */}
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper >
                        <TreeEditor
                            onTreeChange={this.handleTreeRootsChange}
                            initialTreeRoots={this.state.initialTreeRoots}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper >
                        <TreeDisplay />
                    </Paper>
                </Grid>
            </Grid>
            {/* </Container> */}
        </>
    }

    handleTreeRootsChange = (treeRoots: TreeNode[]) => {
        if (this.saveBackupTimeoutHandle) {
            window.clearTimeout(this.saveBackupTimeoutHandle);
        }
        this.saveBackupTimeoutHandle = window.setTimeout(() => {
            const json = JSON.stringify(treeRoots.map(convertTreeNodeToRaw));
            console.log(json);
            window.localStorage.setItem("treeNodes", json);
        }, 1000);
    }

}