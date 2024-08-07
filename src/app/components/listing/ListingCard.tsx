"use client";

import { format } from "date-fns";

import useCountries from "@/app/hooks/useCountries";
import { Listing, Reservation } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

type Props = {
  data: Listing | any;
  reservation?: Reservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser: any;
};

const ListingCard: NextPage<Props> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
}) => {
  const router = useRouter();

  console.log(data);      

  const { getByValue } = useCountries();
  const location = getByValue(data.locationValue || data.listing.locationValue);

  const handleCencel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [actionId, onAction, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div className="col-span-1 cursor-pointer group relative">
      {currentUser && (
        <div className="absolute top-3 right-3 z-30">
          <HeartButton listingId={data.id} currentUser={currentUser} />
        </div>
      )}
      <div
        onClick={() => router.push(`/listings/${data.id}`)}
        className="flex flex-col gap-2 w-full"
      >
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            className="group-hover:scale-110 transition"
            src={data.imageSrc || data?.listing.imageSrc}
            alt="Listing"
          />
        </div>
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$ {price}</div>
          {!reservation && <div className="font-light">night</div>}
        </div>

        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCencel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
