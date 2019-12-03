// 后序遍历二叉树

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function (root) {
    if (root === null) {
        return [];
    }
    var res = [];
    var postOrder = function (root) {
        if (root === null) {
            return null;
        }
        postOrder(root.left);
        postOrder(root.right);

        res.push(root.val);
    };
    postOrder(root);
    return res;
};