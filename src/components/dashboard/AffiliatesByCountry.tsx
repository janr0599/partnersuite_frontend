import { Card, DonutChart, List, ListItem } from "@tremor/react";
import { useQuery } from "@tanstack/react-query";
import { getAffiliates } from "@/api/affiliatesAPI";
import { Affiliates } from "@/types/affiliateTypes";

function classNames(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

// Process affiliate data to group by country and calculate statistics
const processAffiliateData = (affiliates: Affiliates) => {
    const countryData = affiliates.reduce<
        Record<string, { count: number; color: string }>
    >((acc, affiliate) => {
        const country = affiliate.country;
        if (!acc[country]) {
            acc[country] = { count: 0, color: "" };
        }
        acc[country].count += 1;
        return acc;
    }, {});

    const totalAffiliates = affiliates.length;
    const colors = [
        "bg-blue-500",
        "bg-cyan-500",
        "bg-indigo-500",
        "bg-fuchsia-500",
        "bg-purple-500",
    ];
    let colorIndex = 0;

    return Object.keys(countryData).map((country) => {
        const count = countryData[country].count;
        const share = ((count / totalAffiliates) * 100).toFixed(1) + "%";
        const color = colors[colorIndex % colors.length];
        colorIndex += 1;

        return {
            name: country,
            affiliates: count,
            share,
            color,
        };
    });
};

const affiliatesFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
};

export default function AffiliatesByCountryCard() {
    const {
        data: affiliates,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["affiliates"],
        queryFn: getAffiliates,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading affiliates</div>;

    const data = processAffiliateData(affiliates!);

    return (
        <>
            <Card className="sm:mx-auto w-full col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 rounded shadow">
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
