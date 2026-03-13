require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const User = require('../models/User');

const problems = [
    // ARRAYS
    {
        title: 'Two Sum', difficulty: 'easy', topic: 'arrays', companyTags: ['Amazon', 'Google', 'Meta'], conceptTags: ['hash-map', 'array'],
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of two numbers that add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.`,
        examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        hints: ['Try using a hash map to store seen numbers', 'For each number, check if target - number exists in the map'],
        starterCode: { python: 'def twoSum(nums, target):\n    pass', javascript: 'var twoSum = function(nums, target) {\n    \n};', cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    \n}', java: 'public int[] twoSum(int[] nums, int target) {\n    \n}' },
        testCases: [{ input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' }, { input: '[3,2,4]\n6', expectedOutput: '[1,2]' }],
        leetcodeLink: 'https://leetcode.com/problems/two-sum/', gfgLink: 'https://www.geeksforgeeks.org/given-an-array-a-and-a-number-x-check-for-pair-in-a-with-sum-as-x/', orderIndex: 1
    },
    {
        title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', topic: 'arrays', companyTags: ['Amazon', 'Microsoft'], conceptTags: ['greedy', 'array'],
        description: `You are given an array \`prices\` where \`prices[i]\` is the price of a stock on day \`i\`.\n\nYou want to maximize your profit by choosing a day to buy and a later day to sell. Return the maximum profit. If no profit is possible, return 0.`,
        examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6), profit=5' }],
        constraints: ['1 <= prices.length <= 10^5'],
        hints: ['Track the minimum price seen so far', 'At each step, calculate potential profit'],
        starterCode: { python: 'def maxProfit(prices):\n    pass', javascript: 'var maxProfit = function(prices) {\n    \n};', cpp: 'int maxProfit(vector<int>& prices) {\n    \n}', java: 'public int maxProfit(int[] prices) {\n    \n}' },
        testCases: [{ input: '[7,1,5,3,6,4]', expectedOutput: '5' }, { input: '[7,6,4,3,1]', expectedOutput: '0' }],
        leetcodeLink: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', orderIndex: 2
    },
    {
        title: 'Maximum Subarray', difficulty: 'medium', topic: 'arrays', companyTags: ['Amazon', 'Google', 'Microsoft'], conceptTags: ["kadane's-algorithm", 'dynamic-programming'],
        description: `Given an integer array \`nums\`, find the contiguous subarray which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.`,
        examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6' }],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        hints: ["Use Kadane's Algorithm", 'Track current sum and max sum'],
        starterCode: { python: 'def maxSubArray(nums):\n    pass', javascript: 'var maxSubArray = function(nums) {\n    \n};', cpp: 'int maxSubArray(vector<int>& nums) {\n    \n}', java: 'public int maxSubArray(int[] nums) {\n    \n}' },
        testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' }, { input: '[1]', expectedOutput: '1' }],
        leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/', orderIndex: 3
    },
    {
        title: 'Contains Duplicate', difficulty: 'easy', topic: 'arrays', companyTags: ['Amazon', 'Google'], conceptTags: ['hash-set', 'sorting'],
        description: 'Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.',
        examples: [{ input: 'nums = [1,2,3,1]', output: 'true' }, { input: 'nums = [1,2,3,4]', output: 'false' }],
        hints: ['Use a HashSet to track seen numbers'],
        starterCode: { python: 'def containsDuplicate(nums):\n    pass', javascript: 'var containsDuplicate = function(nums) {\n    \n};', cpp: 'bool containsDuplicate(vector<int>& nums) {\n    \n}', java: 'public boolean containsDuplicate(int[] nums) {\n    \n}' },
        testCases: [{ input: '[1,2,3,1]', expectedOutput: 'true' }, { input: '[1,2,3,4]', expectedOutput: 'false' }],
        leetcodeLink: 'https://leetcode.com/problems/contains-duplicate/', orderIndex: 4
    },
    // STRINGS
    {
        title: 'Valid Palindrome', difficulty: 'easy', topic: 'strings', companyTags: ['Amazon', 'Meta'], conceptTags: ['two-pointers', 'string'],
        description: 'A phrase is a palindrome if, after converting all uppercase letters to lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
        examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true' }],
        hints: ['Use two pointers from both ends', 'Skip non-alphanumeric characters'],
        starterCode: { python: 'def isPalindrome(s):\n    pass', javascript: 'var isPalindrome = function(s) {\n    \n};', cpp: 'bool isPalindrome(string s) {\n    \n}', java: 'public boolean isPalindrome(String s) {\n    \n}' },
        testCases: [{ input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' }, { input: '"race a car"', expectedOutput: 'false' }],
        leetcodeLink: 'https://leetcode.com/problems/valid-palindrome/', orderIndex: 10
    },
    {
        title: 'Valid Anagram', difficulty: 'easy', topic: 'strings', companyTags: ['Amazon', 'Google'], conceptTags: ['hash-map', 'sorting'],
        description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn anagram is a word formed by rearranging the letters of another word.',
        examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }],
        hints: ['Count character frequencies', 'Compare frequency maps'],
        starterCode: { python: 'def isAnagram(s, t):\n    pass', javascript: 'var isAnagram = function(s, t) {\n    \n};', cpp: 'bool isAnagram(string s, string t) {\n    \n}', java: 'public boolean isAnagram(String s, String t) {\n    \n}' },
        testCases: [{ input: '"anagram"\n"nagaram"', expectedOutput: 'true' }, { input: '"rat"\n"car"', expectedOutput: 'false' }],
        leetcodeLink: 'https://leetcode.com/problems/valid-anagram/', orderIndex: 11
    },
    {
        title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', topic: 'sliding-window', companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'], conceptTags: ['sliding-window', 'hash-map'],
        description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
        examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The substring "abc" has length 3' }],
        hints: ['Use sliding window with a hash set', 'Expand right, shrink left when duplicate found'],
        starterCode: { python: 'def lengthOfLongestSubstring(s):\n    pass', javascript: 'var lengthOfLongestSubstring = function(s) {\n    \n};', cpp: 'int lengthOfLongestSubstring(string s) {\n    \n}', java: 'public int lengthOfLongestSubstring(String s) {\n    \n}' },
        testCases: [{ input: '"abcabcbb"', expectedOutput: '3' }, { input: '"bbbbb"', expectedOutput: '1' }],
        leetcodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', orderIndex: 20
    },
    // LINKED LISTS
    {
        title: 'Reverse Linked List', difficulty: 'easy', topic: 'linked-lists', companyTags: ['Amazon', 'Microsoft', 'Meta'], conceptTags: ['linked-list', 'recursion'],
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }],
        hints: ['Use three pointers: prev, curr, next', 'Iteratively update pointers'],
        starterCode: { python: 'def reverseList(head):\n    pass', javascript: 'var reverseList = function(head) {\n    \n};', cpp: 'ListNode* reverseList(ListNode* head) {\n    \n}', java: 'public ListNode reverseList(ListNode head) {\n    \n}' },
        testCases: [{ input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' }, { input: '[1,2]', expectedOutput: '[2,1]' }],
        leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list/', orderIndex: 30
    },
    {
        title: 'Linked List Cycle', difficulty: 'easy', topic: 'linked-lists', companyTags: ['Amazon', 'Google'], conceptTags: ['two-pointers', 'floyd-cycle'],
        description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.\nReturn `true` if there is a cycle, `false` otherwise.',
        examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'Tail connects to node at index 1' }],
        hints: ["Use Floyd's Tortoise and Hare algorithm", 'If slow and fast pointers meet, there is a cycle'],
        starterCode: { python: 'def hasCycle(head):\n    pass', javascript: 'var hasCycle = function(head) {\n    \n};', cpp: 'bool hasCycle(ListNode *head) {\n    \n}', java: 'public boolean hasCycle(ListNode head) {\n    \n}' },
        testCases: [{ input: '[3,2,0,-4]\n1', expectedOutput: 'true' }, { input: '[1,2]\n-1', expectedOutput: 'false' }],
        leetcodeLink: 'https://leetcode.com/problems/linked-list-cycle/', orderIndex: 31
    },
    // TREES
    {
        title: 'Maximum Depth of Binary Tree', difficulty: 'easy', topic: 'trees', companyTags: ['Amazon', 'Google', 'Meta'], conceptTags: ['dfs', 'recursion', 'bfs'],
        description: 'Given the root of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from root to the farthest leaf node.',
        examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '3' }],
        hints: ['Use DFS recursively', 'Max depth = 1 + max(left depth, right depth)'],
        starterCode: { python: 'def maxDepth(root):\n    pass', javascript: 'var maxDepth = function(root) {\n    \n};', cpp: 'int maxDepth(TreeNode* root) {\n    \n}', java: 'public int maxDepth(TreeNode root) {\n    \n}' },
        testCases: [{ input: '[3,9,20,null,null,15,7]', expectedOutput: '3' }, { input: '[1,null,2]', expectedOutput: '2' }],
        leetcodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', orderIndex: 40
    },
    {
        title: 'Validate Binary Search Tree', difficulty: 'medium', topic: 'trees', companyTags: ['Amazon', 'Google', 'Microsoft'], conceptTags: ['dfs', 'inorder', 'bst'],
        description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST: left subtree has only nodes with keys less than root, right subtree has only nodes with keys greater than root. Both subtrees must also be valid BSTs.',
        examples: [{ input: 'root = [2,1,3]', output: 'true' }, { input: 'root = [5,1,4,null,null,3,6]', output: 'false' }],
        hints: ['Pass min and max bounds during recursion', 'Each node must satisfy min < node.val < max'],
        starterCode: { python: 'def isValidBST(root):\n    pass', javascript: 'var isValidBST = function(root) {\n    \n};', cpp: 'bool isValidBST(TreeNode* root) {\n    \n}', java: 'public boolean isValidBST(TreeNode root) {\n    \n}' },
        testCases: [{ input: '[2,1,3]', expectedOutput: 'true' }, { input: '[5,1,4,null,null,3,6]', expectedOutput: 'false' }],
        leetcodeLink: 'https://leetcode.com/problems/validate-binary-search-tree/', orderIndex: 41
    },
    // DYNAMIC PROGRAMMING
    {
        title: 'Climbing Stairs', difficulty: 'easy', topic: 'dynamic-programming', companyTags: ['Amazon', 'Google', 'Apple'], conceptTags: ['fibonacci', 'memoization'],
        description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        examples: [{ input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }],
        hints: ['Think Fibonacci sequence', 'dp[i] = dp[i-1] + dp[i-2]'],
        starterCode: { python: 'def climbStairs(n):\n    pass', javascript: 'var climbStairs = function(n) {\n    \n};', cpp: 'int climbStairs(int n) {\n    \n}', java: 'public int climbStairs(int n) {\n    \n}' },
        testCases: [{ input: '3', expectedOutput: '3' }, { input: '4', expectedOutput: '5' }],
        leetcodeLink: 'https://leetcode.com/problems/climbing-stairs/', orderIndex: 50
    },
    {
        title: 'Coin Change', difficulty: 'medium', topic: 'dynamic-programming', companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'], conceptTags: ['dp', 'memoization', 'bfs'],
        description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the fewest number of coins needed to make up the amount. If not possible, return -1.',
        examples: [{ input: 'coins = [1,5,11], amount = 11', output: '1' }],
        hints: ['Use bottom-up DP', 'dp[i] = min coins to make amount i'],
        starterCode: { python: 'def coinChange(coins, amount):\n    pass', javascript: 'var coinChange = function(coins, amount) {\n    \n};', cpp: 'int coinChange(vector<int>& coins, int amount) {\n    \n}', java: 'public int coinChange(int[] coins, int amount) {\n    \n}' },
        testCases: [{ input: '[1,5,11]\n11', expectedOutput: '1' }, { input: '[2]\n3', expectedOutput: '-1' }],
        leetcodeLink: 'https://leetcode.com/problems/coin-change/', orderIndex: 51
    },
    // GRAPHS
    {
        title: 'Number of Islands', difficulty: 'medium', topic: 'graphs', companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Netflix'], conceptTags: ['dfs', 'bfs', 'union-find'],
        description: 'Given an m x n 2D binary grid `grid` which represents a map of "1"s (land) and "0"s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
        examples: [{ input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2' }],
        hints: ['Use DFS/BFS to explore each island', 'Mark visited cells to avoid revisiting'],
        starterCode: { python: 'def numIslands(grid):\n    pass', javascript: 'var numIslands = function(grid) {\n    \n};', cpp: 'int numIslands(vector<vector<char>>& grid) {\n    \n}', java: 'public int numIslands(char[][] grid) {\n    \n}' },
        testCases: [{ input: '[["1","1","0"],["1","1","0"],["0","0","1"]]', expectedOutput: '2' }],
        leetcodeLink: 'https://leetcode.com/problems/number-of-islands/', orderIndex: 60
    },
    // STACKS
    {
        title: 'Valid Parentheses', difficulty: 'easy', topic: 'stacks', companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'], conceptTags: ['stack', 'string'],
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if: Open brackets are closed by the same type, open brackets are closed in the correct order.',
        examples: [{ input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }],
        hints: ['Use a stack', 'Push opening brackets, pop and match for closing'],
        starterCode: { python: 'def isValid(s):\n    pass', javascript: 'var isValid = function(s) {\n    \n};', cpp: 'bool isValid(string s) {\n    \n}', java: 'public boolean isValid(String s) {\n    \n}' },
        testCases: [{ input: '"()[]{}"', expectedOutput: 'true' }, { input: '"(]"', expectedOutput: 'false' }],
        leetcodeLink: 'https://leetcode.com/problems/valid-parentheses/', orderIndex: 70
    },
    // BINARY SEARCH
    {
        title: 'Binary Search', difficulty: 'easy', topic: 'binary-search', companyTags: ['Amazon', 'Google'], conceptTags: ['binary-search', 'array'],
        description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1.',
        examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
        hints: ['Use two pointers: left and right', 'Calculate mid = (left + right) // 2'],
        starterCode: { python: 'def search(nums, target):\n    pass', javascript: 'var search = function(nums, target) {\n    \n};', cpp: 'int search(vector<int>& nums, int target) {\n    \n}', java: 'public int search(int[] nums, int target) {\n    \n}' },
        testCases: [{ input: '[-1,0,3,5,9,12]\n9', expectedOutput: '4' }, { input: '[-1,0,3,5,9,12]\n2', expectedOutput: '-1' }],
        leetcodeLink: 'https://leetcode.com/problems/binary-search/', orderIndex: 80
    },
    // HASHING
    {
        title: 'Group Anagrams', difficulty: 'medium', topic: 'hashing', companyTags: ['Amazon', 'Google', 'Meta'], conceptTags: ['hash-map', 'sorting'],
        description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
        examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }],
        hints: ['Sort each string as the key', 'Group strings with same sorted key'],
        starterCode: { python: 'def groupAnagrams(strs):\n    pass', javascript: 'var groupAnagrams = function(strs) {\n    \n};', cpp: 'vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    \n}', java: 'public List<List<String>> groupAnagrams(String[] strs) {\n    \n}' },
        testCases: [{ input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }],
        leetcodeLink: 'https://leetcode.com/problems/group-anagrams/', orderIndex: 90
    },
    // GREEDY
    {
        title: 'Jump Game', difficulty: 'medium', topic: 'greedy', companyTags: ['Amazon', 'Google', 'Microsoft'], conceptTags: ['greedy', 'array'],
        description: 'You are given an integer array `nums`. You are initially positioned at the first index, and each element represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.',
        examples: [{ input: 'nums = [2,3,1,1,4]', output: 'true' }, { input: 'nums = [3,2,1,0,4]', output: 'false' }],
        hints: ['Track the farthest reachable index', 'Greedy: keep extending the reach'],
        starterCode: { python: 'def canJump(nums):\n    pass', javascript: 'var canJump = function(nums) {\n    \n};', cpp: 'bool canJump(vector<int>& nums) {\n    \n}', java: 'public boolean canJump(int[] nums) {\n    \n}' },
        testCases: [{ input: '[2,3,1,1,4]', expectedOutput: 'true' }, { input: '[3,2,1,0,4]', expectedOutput: 'false' }],
        leetcodeLink: 'https://leetcode.com/problems/jump-game/', orderIndex: 100
    },
    // BACKTRACKING
    {
        title: 'Subsets', difficulty: 'medium', topic: 'backtracking', companyTags: ['Amazon', 'Google'], conceptTags: ['backtracking', 'bit-manipulation'],
        description: 'Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets.',
        examples: [{ input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }],
        hints: ['Use backtracking', 'At each index, choose to include or exclude the element'],
        starterCode: { python: 'def subsets(nums):\n    pass', javascript: 'var subsets = function(nums) {\n    \n};', cpp: 'vector<vector<int>> subsets(vector<int>& nums) {\n    \n}', java: 'public List<List<Integer>> subsets(int[] nums) {\n    \n}' },
        testCases: [{ input: '[1,2,3]', expectedOutput: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }],
        leetcodeLink: 'https://leetcode.com/problems/subsets/', orderIndex: 110
    },
    // RECURSION
    {
        title: 'Fibonacci Number', difficulty: 'easy', topic: 'recursion', companyTags: ['Amazon', 'Google'], conceptTags: ['recursion', 'memoization', 'dp'],
        description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nGiven n, calculate F(n).',
        examples: [{ input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' }],
        hints: ['Base cases: F(0) = 0, F(1) = 1', 'Use memoization to avoid redundant computation'],
        starterCode: { python: 'def fib(n):\n    pass', javascript: 'var fib = function(n) {\n    \n};', cpp: 'int fib(int n) {\n    \n}', java: 'public int fib(int n) {\n    \n}' },
        testCases: [{ input: '4', expectedOutput: '3' }, { input: '10', expectedOutput: '55' }],
        leetcodeLink: 'https://leetcode.com/problems/fibonacci-number/', orderIndex: 120
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_mastery');
        console.log('Connected to MongoDB');

        // Clear existing problems
        await Problem.deleteMany({});
        console.log('Cleared existing problems');

        // Insert problems (use save() loop so pre-save slug hook runs)
        for (const p of problems) {
            await new Problem(p).save();
        }
        console.log(`✅ Seeded ${problems.length} problems`);

        // Create admin user if not exists
        const adminExists = await User.findOne({ email: 'admin@dsamastery.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@dsamastery.com',
                password: 'Admin@1234',
                role: 'admin',
                skillLevel: 'advanced',
                coins: 9999
            });
            console.log('✅ Admin user created: admin@dsamastery.com / Admin@1234');
        }

        // Create demo user
        const demoExists = await User.findOne({ email: 'demo@dsamastery.com' });
        if (!demoExists) {
            await User.create({
                name: 'Demo User',
                email: 'demo@dsamastery.com',
                password: 'Demo@1234',
                skillLevel: 'intermediate',
                coins: 250,
                streak: 5,
                totalSolved: 12
            });
            console.log('✅ Demo user created: demo@dsamastery.com / Demo@1234');
        }

        console.log('\n🎉 Seed complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err.message);
        process.exit(1);
    }
}

seed();
