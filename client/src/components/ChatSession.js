import React from "react";
import Proptypes from "prop-types";
import { format } from "date-fns";
import MicrolinkCard from "@microlink/react";

const insertTextAtIndices = (text, obj) => {
  return text.replace(/./g, function(character, index) {
    return obj[index] ? obj[index] + character : character;
  });
};

const ChatSession = props => {
  const { messages } = props;
  return messages.map(message => {
    const time = format(new Date(`${message.updatedAt}`), "HH:mm");
    const urlMatches = message.text.match(/\b(http|https)?:\/\/\S+/gi) || [];

    let { text } = message;
    urlMatches.forEach(link => {
      const startIndex = text.indexOf(link);
      const endIndex = startIndex + link.length;
      text = insertTextAtIndices(text, {
        [startIndex]: `<a href="${link}" target="_blank" rel="noopener noreferrer" class="embedded-link">`,
        [endIndex]: "</a>"
      });
    });

    const LinkPreviews = urlMatches.map(link => <MicrolinkCard url={link} />);

    return (
      <li className="message" key={message.id}>
        {urlMatches.length > 0 ? (
          <div>
            <span className="user-id">{message.senderId}</span>
            <span
              dangerouslySetInnerHTML={{
                __html: text
              }}
            />
            {LinkPreviews}
          </div>
        ) : (
          <div>
            <span className="user-id">{message.senderId}</span>
            <span>{message.text}</span>
          </div>
        )}
        <span className="message-time">{time}</span>
      </li>
    );
  });
};

ChatSession.propTypes = {
  messages: Proptypes.arrayOf(Proptypes.object).isRequired
};

export default ChatSession;
