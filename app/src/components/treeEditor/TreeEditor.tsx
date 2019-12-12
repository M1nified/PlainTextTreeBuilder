import { Button, IconButton, InputBase, Paper, SvgIcon, Tooltip } from '@material-ui/core';
import { mdiHandRight, mdiPlus } from '@mdi/js';
import React, { Component } from 'react';
import { convertRawToTreeNode, TreeNode, TreeNodeRaw } from "../../models/TreeNode";
import './TreeEditor.scss';

type TreeEditorState = {
    treeRoots: TreeNode[],
    draggedNode?: TreeNode,
    nodeToDropIn?: TreeNode,
}

type TreeEditorProps = {
    onTreeChange?(treeNodes: TreeNode[]): any,
    initialTreeRoots?: TreeNodeRaw[],
}

export default class TreeEditor extends Component<TreeEditorProps, TreeEditorState> {

    state: TreeEditorState = {
        treeRoots: [],
    }

    componentDidUpdate(prevProps: TreeEditorProps) {
        if (typeof prevProps.initialTreeRoots === 'undefined' && Array.isArray(this.props.initialTreeRoots)) {
            const treeRoots = this.props.initialTreeRoots.map((tnr) => convertRawToTreeNode(tnr));
            this.setStateRoots(treeRoots);
        }
    }

    render() {
        return <>
            {this.state.treeRoots.map(this.renderTreeRoot)}
            {this.renderNewTreeNodeButton()}
            {this.renderUi()}
        </>
    }



    renderUi = () => {
        return <>

        </>
    }

    renderTreeRoot = (treeRoot: TreeNode, idx: number) => {
        return <div
            key={idx}
            onDragEnter={() => {
                this.setState({
                    nodeToDropIn: treeRoot,
                })
            }}
        >
            <Paper
                draggable
                onDragStart={() => this.setState({ draggedNode: treeRoot })}
                onDragEnd={this.handleDropIn}
            >
                <span className="MuiButtonBase-root MuiIconButton-root" style={{ cursor: "move" }}>
                    <SvgIcon><path d={mdiHandRight} /></SvgIcon>
                </span>
                <InputBase
                    className="treeNode"
                    value={treeRoot.value}
                    onChange={(evt) => {
                        treeRoot.value = evt.target.value;
                        this.setStateRoots();
                    }}
                    placeholder="Node value"
                />
                {/* {this.renderNewTreeNodeButton(treeRoot)} */}
                {/* <Divider orientation="vertical" /> */}
                <Tooltip title="Add child">
                    <IconButton
                        onClick={() => this.handleNewNodeClick(treeRoot)}
                    >
                        <SvgIcon><path d={mdiPlus} /></SvgIcon>
                    </IconButton>
                </Tooltip>
            </Paper>

            <div className="treeNode-children">
                {treeRoot.children.map(this.renderTreeRoot)}
            </div>
        </div>
    }

    renderNewTreeNodeButton = (parentTreeNode?: TreeNode) => {
        return <>
            <Button variant="outlined" onClick={() => this.handleNewNodeClick(parentTreeNode)}>Add node</Button>
        </>
    }

    setStateRoots = (treeRoots?: TreeNode[]) => {
        this.setState({
            treeRoots: treeRoots || this.state.treeRoots,
        }, () => {
            if (typeof this.props.onTreeChange === 'function') {
                this.props.onTreeChange(this.state.treeRoots);
            }
        })
    }

    handleDropIn = () => {
        const { draggedNode, nodeToDropIn } = this.state;
        try {
            if (!draggedNode || !nodeToDropIn)
                throw 1;
            if (nodeToDropIn.parent && draggedNode.id === nodeToDropIn.parent.id)
                throw "Cannot drop into itself.";
            // TO;DO
        } catch (err) {
        } finally {
            this.setState({ draggedNode: undefined, nodeToDropIn: undefined });
        }

    }

    handleNewNodeClick = (parentTreeNode?: TreeNode) => {
        if (!parentTreeNode) {
            this.setState({
                treeRoots: [...this.state.treeRoots, new TreeNode("", [])],
            })
        } else {
            parentTreeNode.children.push(new TreeNode("", []));
            this.setState({
                treeRoots: this.state.treeRoots,
            })
        }
    }

}