require("dotenv").config();

import { Response } from "express";
import { responseErrors } from "../utils/common";
import { AppDataSource } from "../ormconfig";
import { ChatbotAsked } from "../entities/chatbot-asked.entity";
const dialogflow = require("@google-cloud/dialogflow").v2beta1;

const chatbotAskedRepository = AppDataSource.getRepository(ChatbotAsked);

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS ?? "");
const PROJECID = CREDENTIALS.project_id;
const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS["private_key"],
    client_email: CREDENTIALS["client_email"],
  },
};
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

export const intentDialogflowsHandler = async (req: any, res: Response) => {
  try {
    let queryText = req.body.queryText;
    let sessionId = req.body.sessionId;

    let responseData = await detectIntentKnowLageBase(queryText, sessionId);

    if (sessionId && sessionId !== "home") {
      const userId = req.user.id;
      const lessionId = sessionId;

      const chatbotAsked = await chatbotAskedRepository
        .createQueryBuilder("chatbot_asked")
        .where("chatbot_asked.user_id = :userId", { userId })
        .andWhere("chatbot_asked.lession_id = :lessionId", { lessionId })
        .getOne();

      if (!chatbotAsked) {
        const newChatbotAsked = new ChatbotAsked();
        newChatbotAsked.chatbot_asked = 1;
        newChatbotAsked.user = userId;
        newChatbotAsked.lession = lessionId;
        await chatbotAskedRepository.save(newChatbotAsked);
      } else {
        chatbotAsked.chatbot_asked += 1;
        await chatbotAskedRepository.save(chatbotAsked);
      }
    }

    res.status(200).json({
      status: "success",
      text: responseData.response,
    });
  } catch (err: any) {
    return responseErrors(res, 400, err.message);
  }
};

export const detectIntent = async (queryText: any, sessionId: any) => {
  let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: "en",
      },
    },
    queryParams: {
      source: "DIALOGFLOW_CONSOLE",
      timeZone: "Asia/Bangkok",
      sentimentAnalysisRequestConfig: {
        analyzeQueryTextSentiment: true,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  let responseData;

  if (!result?.fulfillmentText) {
    if (result?.fulfillmentMessages![0]) {
      responseData =
        result?.fulfillmentMessages![0].payload!.fields!.line!.structValue
          ?.fields!.text.stringValue;
    } else {
      responseData = "ติดต่อคุณครูได้โดยตรงเลยครับ";
    }
  }

  return {
    response: responseData ? responseData : result?.fulfillmentText,
  };
};

export const detectIntentKnowLageBase = async (
  queryText: any,
  sessionId: any
) => {
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const projectId = 'ID of GCP project associated with your Dialogflow agent';
  // const sessionId = `user specific ID of session, e.g. 12345`;
  // const languageCode = 'BCP-47 language code, e.g. en-US';
  // const knowledgeBaseId = `the ID of your KnowledgeBase`;
  // const query = `phrase(s) to pass to detect, e.g. I'd like to reserve a room for six people`;

  let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

  const knowledgeBasePath: any[] = [
    "projects/" +
      PROJECID +
      "/knowledgeBases/" +
      "MTYxNTg2MTkxNDQ2MjE2NTQwMTY" +
      "",
  ];

  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: "en",
      },
    },
    queryParams: {
      knowledgeBaseNames: knowledgeBasePath,
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;

  if (!result) {
    throw new Error("Cannot get intent");
  }

  let responseData = result?.fulfillmentText;

  if (!responseData) {
    responseData = "ติดต่อคุณโดยตรงได้เลยครับ";
  }

  return {
    response: responseData,
  };
};
