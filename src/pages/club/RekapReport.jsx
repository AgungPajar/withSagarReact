import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from '../../utils/axiosConfig';
import SidebarClub from '../../components/SidebarClub';

const ReportByEkskulPage = () => {
	const { clubId } = useParams();
	const [activityReports, setActivityReports] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiClient.get(`/clubs/${clubId}/activity-reports`)
			.then(res => {
				console.log('Data laporan:', res.data); // log ini dulu
				setActivityReports(res.data); // ini bisa diganti tergantung hasil log
				setLoading(false);
			})
			.catch(err => {
				console.error(err);
				setLoading(false);
			});
	}, [clubId]);



	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<SidebarClub />
			<main className="flex-1 p-10 pt-24 md:ml-64">
				<h1 className="text-xl font-bold mb-4">Rekap Laporan Ekskul</h1>
				<div className="overflow-x-auto">
					<table className="min-w-full border text-sm">
						<thead>
							<tr className="bg-gray-100">
								<th className="border px-2 py-1">No</th>
								<th className="border px-2 py-1">Tanggal</th>
								<th className="border px-2 py-1">Poto</th>
								<th className="border px-2 py-1">Materi</th>
								<th className="border px-2 py-1">Tempat</th>
							</tr>
						</thead>
						<tbody>
							{activityReports.length === 0 ? (
								<tr>
									<td colSpan={4} className="text-center py-4">
										Belum ada laporan.
									</td>
								</tr>
							) : (
								activityReports.map((r, index) => (
									<tr key={index}>
										<td className="border px-2 py-1 w-10 text-center">{index + 1}</td>
										<td className="border px-2 py-1 w-28 whitespace-nowrap text-center">
											{r.date}
										</td>
										<td className="border px-2 py-1 w-28 text-center">
											<a href={r.photo_url} target="_blank" rel="noopener noreferrer">
												<img
													src={r.photo_url}
													alt={`Foto Laporan tanggal ${r.date}`}
													className="w-16 h-16 object-cover rounded hover:scale-105 transition duration-200"
												/>
											</a>
										</td>
										<td className="border px-2 py-1">{r.materi}</td>
										<td className="border px-2 py-1">{r.tempat}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
};

export default ReportByEkskulPage;
