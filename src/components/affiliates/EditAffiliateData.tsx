import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAffiliateById } from "@/api/affiliatesAPI";
import { Affiliate } from "@/types/affiliateTypes";
import EditAffiliateModal from "./EditAffiliateModal";

function EditAffiliateData() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const affiliateId = queryParams.get("editAffiliate")!;

    const { data, isError } = useQuery<Affiliate>({
        queryKey: ["affiliate", affiliateId],
        queryFn: () => getAffiliateById(affiliateId),
        enabled: !!affiliateId, // evaluates a value as true or false whether they have a value or not, in this case if affiliateId has a value it's because it's present in the url and we want the query to run
        retry: false,
    });

    if (isError) return <Navigate to={"/404"} />;

    if (data) return <EditAffiliateModal affiliate={data} />;
}

export default EditAffiliateData;
