// import { Fragment, useEffect } from "react";
// import {
//     Dialog,
//     DialogPanel,
//     DialogTitle,
//     Transition,
//     TransitionChild,
// } from "@headlessui/react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import { Task } from "@/types/taskTypes";
// // import { getTaskById, updateTaskStatus } from "@/api/taskAPI";
// import { toast } from "react-toastify";
// import { formatDate } from "@/utils/utils";
// import { statusTranslations } from "@/locales/en";
// import { Ticket } from "@/types/ticketsTypes";
// import { getTicketById, updateTicketStatus } from "@/api/ticketsAPI";
// // import NotesPanel from "../notes/NotesPanel";

// const TicketDetailsModalNew = () => {
//     const navigate = useNavigate();

//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const ticketId = queryParams.get("viewTicket")!;

//     const show = !!ticketId;

//     // const params = useParams();
//     // const projectId = params.projectId!;

//     const { data, isError, error } = useQuery<Ticket>({
//         queryKey: ["ticket", ticketId],
//         queryFn: () => getTicketById(ticketId),
//         enabled: !!ticketId,
//         retry: false,
//     });

//     const queryClient = useQueryClient();
//     const { mutate } = useMutation({
//         mutationFn: updateTicketStatus,
//         onError: (error) => {
//             toast.error(error.message);
//         },
//         onSuccess: (message) => {
//             queryClient.invalidateQueries({
//                 queryKey: ["tickets"],
//             });
//             queryClient.invalidateQueries({
//                 queryKey: ["ticket", ticketId],
//             });
//             toast.success(message);
//             navigate(location.pathname, { replace: true });
//         },
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const status = e.target.value as Ticket["status"];

//         mutate({
//             ticketId,
//             status,
//         });
//     };

//     useEffect(() => {
//         if (isError) {
//             toast.error(error.message);
//             navigate("/");
//         }
//     }, [isError]);

//     if (data)
//         return (
//             <Transition appear show={show} as={Fragment}>
//                 <Dialog
//                     as="div"
//                     className="relative z-10000"
//                     onClose={() =>
//                         navigate(location.pathname, { replace: true })
//                     }
//                 >
//                     <TransitionChild
//                         as={Fragment}
//                         enter="ease-out duration-300"
//                         enterFrom="opacity-0"
//                         enterTo="opacity-100"
//                         leave="ease-in duration-200"
//                         leaveFrom="opacity-100"
//                         leaveTo="opacity-0"
//                     >
//                         <div className="fixed inset-0 bg-black/60" />
//                     </TransitionChild>
//                     <div className="fixed inset-0 overflow-y-auto">
//                         <div className="flex min-h-full items-center justify-center p-4 text-center">
//                             <TransitionChild
//                                 as={Fragment}
//                                 enter="ease-out duration-300"
//                                 enterFrom="opacity-0 scale-95"
//                                 enterTo="opacity-100 scale-100"
//                                 leave="ease-in duration-200"
//                                 leaveFrom="opacity-100 scale-100"
//                                 leaveTo="opacity-0 scale-95"
//                             >
//                                 <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all py-8 px-12">
//                                     <div className="md:flex justify-between items-center ">
//                                         <div className="order-last mb-auto">
//                                             <p className="text-sm text-slate-400">
//                                                 Created on:{" "}
//                                                 {formatDate(data.createdAt)}
//                                             </p>
//                                             <p className="text-sm text-slate-400">
//                                                 Last update:{" "}
//                                                 {formatDate(data.updatedAt)}
//                                             </p>
//                                         </div>

//                                         <div className="">
//                                             <DialogTitle
//                                                 as="h3"
//                                                 className="font-black text-4xl text-slate-600 my-5"
//                                             >
//                                                 {data.title}
//                                             </DialogTitle>
//                                             <p className="text-lg text-slate-500 mb-2 max-w-[550px]">
//                                                 Description: {data.description}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="mt-5 mb-10 space-y-3">
//                                         <label className="font-bold block">
//                                             Status:
//                                         </label>
//                                         <select
//                                             className="w-1/4 p-3 bg-white border border-gray-300 rounded-lg"
//                                             defaultValue={data.status}
//                                             onChange={handleChange}
//                                         >
//                                             {Object.entries(
//                                                 statusTranslations
//                                             ).map(([key, value]) => (
//                                                 <option key={key} value={key}>
//                                                     {value}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </DialogPanel>
//                             </TransitionChild>
//                         </div>
//                     </div>
//                 </Dialog>
//             </Transition>
//         );
// };

// export default TicketDetailsModalNew;
