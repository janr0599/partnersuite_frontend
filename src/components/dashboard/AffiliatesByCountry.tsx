import { Card, DonutChart, List, ListItem } from "@tremor/react";

function classNames(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

const data = [
    {
        name: "USA",
        affiliates: 150,
        share: "30.0%",
        color: "bg-blue-500",
    },
    {
        name: "Canada",
        affiliates: 100,
        share: "20.0%",
        color: "bg-cyan-500",
    },
    {
        name: "UK",
        affiliates: 80,
        share: "16.0%",
        color: "bg-indigo-500",
    },
    {
        name: "Germany",
        affiliates: 70,
        share: "14.0%",
        color: "bg-fuchsia-500",
    },
    {
        name: "Australia",
        affiliates: 100,
        share: "20.0%",
        color: "bg-purple-500",
    },
];

const affiliatesFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
};

export default function AffiliatesByCountryCard() {
    return (
        <>
            <Card className="sm:mx-auto sm:max-w-lg min-w-full col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 rounded shadow">
                <h3 className="text-tremor-default font-medium text-tremor-content-strong">
                    Affiliates by Country
                </h3>
                <DonutChart
                    className="mt-8"
                    data={data}
                    category="affiliates"
                    index="name"
                    valueFormatter={affiliatesFormatter}
                    showTooltip={true}
                    colors={["blue", "cyan", "indigo", "fuchsia", "purple"]}
                />
                <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content-strong">
                    <span>Country</span>
                    <span>Affiliates / Share</span>
                </p>
                <List className="mt-2">
                    {data.map((item) => (
                        <ListItem key={item.name} className="space-x-6">
                            <div className="flex items-center space-x-2.5 truncate">
                                <span
                                    className={classNames(
                                        item.color,
                                        "size-2.5 shrink-0 rounded-sm"
                                    )}
                                    aria-hidden={true}
                                />
                                <span className="truncate text-tremor-content-emphasis">
                                    {item.name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium tabular-nums text-tremor-content-strong">
                                    {affiliatesFormatter(item.affiliates)}
                                </span>
                                <span className="rounded-tremor-small bg-slate-200 px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-indigo-500 ">
                                    {item.share}
                                </span>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </Card>
        </>
    );
}
