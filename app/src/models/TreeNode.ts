import uniqid from 'uniqid';

export type TreeNodeRaw = {
    value: string,
    children: TreeNodeRaw[],
}

export class TreeNode implements TreeNodeRaw {

    value: string = "";
    children: TreeNode[] = [];
    id: string;
    parent?: TreeNode;

    constructor(value: string, children: TreeNode[], parent?: TreeNode) {
        if (Array.isArray(children)) {
            this.children.push(...children)
        }
        this.id = uniqid();
        this.value = value;
        this.parent = parent;
    }
}

export const convertRawToTreeNode = (tnr: TreeNodeRaw, parent?: TreeNode): TreeNode => {
    const { value, children: childrenRaw } = tnr;
    const treeNode = new TreeNode(value, [], parent);
    const children = childrenRaw.map((tn) => convertRawToTreeNode(tn, treeNode));
    treeNode.children = children;
    return treeNode;
}

export const convertTreeNodeToRaw = (tn: TreeNode): TreeNodeRaw => {
    const { value, children } = tn;
    const childrenRaw = children.map((tn) => convertTreeNodeToRaw(tn));
    return {
        value,
        children: childrenRaw,
    };
}