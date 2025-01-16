"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { PDFDownloadLink } from '@react-pdf/renderer'
import RekapPenyaluran from '@/components/FeatureComponents/CetakDistribusi/RekapPenyaluran'
import { Printer } from 'lucide-react'

const DownloadRekap = ({filteredData, data, allocationDaily,allocationMonthly, isAgentFiltered}:any)  => {
  return (
    <Button
        variant="default"
        className="w-full sm:w-auto flex items-center justify-center"
        asChild
    >
        <PDFDownloadLink
        className="text-center"
        document={
            <RekapPenyaluran
            data={filteredData != null ? filteredData : data}
            data2={allocationMonthly}
            data3={allocationDaily}
            isAgentFiltered={isAgentFiltered}
            />
        }
        fileName={`Rekap Penyaluran Elpiji.pdf`}
        >
        <Printer className="h-4 w-4 text-green-500 cursor-pointer mr-2" />
        <span className="truncate">Cetak Rekap</span>
        </PDFDownloadLink>
    </Button>
  )
}

export default DownloadRekap
