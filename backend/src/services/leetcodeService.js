const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LEETCODE_GQL_URL = 'https://leetcode.com/graphql';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://leetcode.com',
    'Content-Type': 'application/json'
};

const getHeaders = (cookie) => {
    const headers = { ...HEADERS };
    if (cookie) {
        headers['Cookie'] = `LEETCODE_SESSION=${cookie};`;
    }
    return headers;
};

const fetchUserProfile = async (cookie) => {
    const query = `
        query userStatus {
            userStatus {
                username
                isSignedIn
            }
        }
    `;
    try {
        const response = await axios.post(LEETCODE_GQL_URL, { query }, { headers: getHeaders(cookie) });
        const userStatus = response.data?.data?.userStatus;
        if (!userStatus || !userStatus.isSignedIn) {
            return null;
        }
        return userStatus;
    } catch (err) {
        console.error("LeetCode profile fetch error:", err.message);
        return null;
    }
}

const fetchSolvedProblems = async (username, cookie) => {
    const query = `
        query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
            }
        }
    `;
    try {
        const response = await axios.post(LEETCODE_GQL_URL, {
            query,
            variables: { username }
        }, { headers: getHeaders(cookie) });

        const data = response.data?.data;
        if (!data || !data.matchedUser) {
            console.warn(`LeetCode user not found or API error for: ${username}`);
            return null;
        }

        const stats = data.matchedUser.submitStats?.acSubmissionNum;
        if (!stats) {
            console.warn(`No submission stats found for user: ${username}`);
            return null;
        }
        return stats;
    } catch (err) {
        console.error("LeetCode fetch error details:", err.response?.data || err.message);
        throw err;
    }
};

const fetchRecentSubmissions = async (username, cookie, limit = 20) => {
    const query = `
        query recentSubmissions($username: String!, $limit: Int!) {
            recentSubmissionList(username: $username, limit: $limit) {
                titleSlug
                timestamp
                statusDisplay
            }
        }
    `;

    try {
        const response = await axios.post(LEETCODE_GQL_URL, {
            query,
            variables: { username, limit }
        }, { headers: getHeaders(cookie) });

        return response.data?.data?.recentSubmissionList?.filter(s => s.statusDisplay === 'Accepted') || [];
    } catch (err) {
        console.error("LeetCode recent submissions fetch error:", err);
        return [];
    }
};

const fetchProblemDetail = async (slug, cookie) => {
    const query = `
        query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                title
                difficulty
            }
        }
    `;

    try {
        const response = await axios.post(LEETCODE_GQL_URL, {
            query,
            variables: { titleSlug: slug }
        }, { headers: getHeaders(cookie) });
        return response.data.data.question;
    } catch (err) {
        console.error("LeetCode problem detail fetch error:", err);
        return null;
    }
};

module.exports = {
    fetchUserProfile,
    fetchSolvedProblems,
    fetchRecentSubmissions,
    fetchProblemDetail
};
