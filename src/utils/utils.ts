export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const formatter = new Intl.DateTimeFormat("en-En", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return formatter.format(date);
};

export const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(timestamp).getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
        return `${seconds}s ago`;
    } else if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        const date = new Date(timestamp);
        return `${date.getMonth() + 1}/${date.getDate()}/${date
            .getFullYear()
            .toString()
            .substr(-2)}`;
    }
};
